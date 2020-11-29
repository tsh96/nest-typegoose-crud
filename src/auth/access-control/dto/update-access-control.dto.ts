import { ApiProperty } from "@nestjs/swagger";

export class UpdateAccessControlDto {
  @ApiProperty()
  role: string
}