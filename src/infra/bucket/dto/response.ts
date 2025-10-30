import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class GenerateUploadUrlResponseDTO {
  @ApiProperty({
    type: String,
  })
  @IsUrl()
  url!: string;

  @ApiProperty({
    example: "photos/trucks/adb4a669-c0f1-4b77-ad67-ab8d5ecf8b70.txt",
  })
  key!: string;

  @ApiProperty({
    example: 900, // 15 minutes
  })
  expiresIn!: number;
}
