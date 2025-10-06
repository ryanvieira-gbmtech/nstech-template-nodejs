import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DATABASE_CONNECTION } from "@/infra/database/database.module";
import Database from "@/infra/database/schema/Database";
import Mandatory from "@/infra/database/schema/public/Mandatory";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { Repository } from "./interfaces";

interface FieldDTO {
  productId: number[] | null;
  operationTypeTag: string[] | null;
  label: string;
  isRequired: Mandatory;
}

export interface FieldFormattedDTO extends Omit<FieldDTO, "productId" | "operationTypeTag"> {
  productId: number[] | null;
  operationTypeTag: string[] | null;
}

export class FormRepository extends Repository<Database>(DATABASE_CONNECTION) {
  async findManyBy(terminalId: TerminalsId) {
    const forms = await this.db
      .withSchema("public")
      .selectFrom("configForms as cf")
      .select((eb) => [
        "cf.id",
        "cf.name",
        jsonArrayFrom(
          eb
            .selectFrom("configFormFields as cff")
            .innerJoin("configTerminalFormFields as ctff", "ctff.fieldId", "cff.id")
            .leftJoin("operationsType as ot", "ot.id", "ctff.operationTypeId")
            .select([
              "ctff.id",
              "cff.name",
              "ctff.label",
              "ctff.isRequired",
              "ctff.productId",
              "ot.tag as operationTypeTag",
            ])
            .whereRef("cff.formId", "=", "cf.id")
            .where("ctff.isActive", "=", true)
            .where("ctff.terminalId", "=", terminalId),
        ).as("fields"),
      ])
      .execute();

    const formattedForms = forms.map((form) => {
      if (form.fields.length === 0) {
        return { ...form, fields: null };
      }

      const fieldMap = new Map<string, FieldDTO>();

      for (const field of form.fields) {
        if (fieldMap.has(field.name)) {
          const existingField = fieldMap.get(field.name)!;

          if (field.productId) {
            existingField.productId = existingField.productId
              ? [...existingField.productId, field.productId]
              : [field.productId];
          }

          if (field.operationTypeTag) {
            existingField.operationTypeTag = existingField.operationTypeTag
              ? [...existingField.operationTypeTag, field.operationTypeTag]
              : [field.operationTypeTag];
          }
        } else {
          fieldMap.set(field.name, {
            productId: field.productId ? [field.productId] : null,
            operationTypeTag: field.operationTypeTag ? [field.operationTypeTag] : null,
            label: field.label,
            isRequired: field.isRequired,
          });
        }
      }

      const formattedFields = Object.fromEntries(
        Array.from(fieldMap.entries()).map(([key, field]) => [
          key,
          {
            ...field,
            productId: field.productId ? Array.from(new Set(field.productId)) : null,
            operationTypeTag: field.operationTypeTag
              ? Array.from(new Set(field.operationTypeTag))
              : null,
          },
        ]),
      );

      return {
        ...form,
        fields: formattedFields,
      };
    });

    return formattedForms;
  }
}
