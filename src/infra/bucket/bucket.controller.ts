import { Body, Controller, Post, SerializeOptions } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BucketService } from "./bucket.service";
import { GenerateUploadUrlRequestDTO } from "./dto/request";
import { GenerateUploadUrlResponseDTO } from "./dto/response";

@ApiTags("bucket")
@Controller("bucket")
export class BucketController {
  constructor(private bucketService: BucketService) {}

  @Post("upload")
  @ApiOperation({
    operationId: "generateUploadUrl",
    summary: "Gera uma URL para upload de arquivos",
  })
  @ApiCreatedResponse({
    type: GenerateUploadUrlResponseDTO,
  })
  @SerializeOptions({ type: GenerateUploadUrlResponseDTO })
  async generateUploadUrl(@Body() body: GenerateUploadUrlRequestDTO) {
    const url = await this.bucketService.generateUploadUrl(
      body.folder,
      body.fileName,
      body.mimetype,
    );

    return url;
  }
}
