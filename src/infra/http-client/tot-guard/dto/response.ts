import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";

export class UserDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  username!: string;

  @ApiProperty()
  @Expose()
  groupId!: number;

  @ApiProperty()
  @Expose()
  isActive!: boolean;

  @ApiProperty()
  @Expose()
  type!: string;

  @ApiProperty()
  @Expose()
  multiTerminal!: false;
}

export class ModuleDTO {
  @ApiProperty()
  @Expose()
  id!: number;
}

export class AllowedPathDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  path!: string;

  @ApiProperty()
  @Expose()
  read!: boolean;

  @ApiProperty()
  @Expose()
  create!: boolean;

  @ApiProperty()
  @Expose()
  edit!: boolean;

  @ApiProperty()
  @Expose()
  delete!: boolean;
}

export class CompanyDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  isActive!: boolean;
}

export class TerminalDTO extends OmitType(CompanyDTO, ["id"]) {
  @ApiProperty({ type: Number })
  @Expose()
  id!: TerminalsId;
}

export class GetUserProfileResponseDTO {
  @ApiProperty({ type: [UserDTO] })
  @Expose()
  @Type(() => UserDTO)
  user!: UserDTO;

  @ApiProperty({ type: [ModuleDTO] })
  @Expose()
  @Type(() => ModuleDTO)
  modules!: ModuleDTO[];

  @ApiProperty({ type: [AllowedPathDTO] })
  @Expose()
  @Type(() => AllowedPathDTO)
  allowedPaths!: AllowedPathDTO[];

  @ApiProperty({ type: [String] })
  @Expose()
  features!: string[];

  @ApiProperty({ type: [TerminalDTO] })
  @Expose()
  @Type(() => TerminalDTO)
  terminals!: TerminalDTO[];

  @ApiProperty({ type: [CompanyDTO] })
  @Expose()
  @Type(() => CompanyDTO)
  railroads!: CompanyDTO[];

  @ApiProperty({ type: Boolean })
  @Expose()
  hasAcceptedTerm!: boolean;
}
