import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMimeType, IsString } from "class-validator";

export class GenerateUploadUrlRequestDTO {
  @ApiProperty({
    description: "O nome do arquivo a ser enviado",
    example: "example.txt",
  })
  @IsString()
  fileName!: string;

  @ApiProperty({
    description: "A extensão do arquivo a ser enviado",
    type: String,
    example: "image/png",
  })
  @IsMimeType()
  mimetype!: string;

  @ApiProperty({
    type: String,
    examples: ["trucks", "wagons"],
    example: "trucks",
  })
  @IsIn(["trucks", "wagons"])
  folder!: "trucks" | "wagons";
}
