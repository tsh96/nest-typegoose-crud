import { ApiProperty } from "@nestjs/swagger";

export class FilterAccessControlDto {
  @ApiProperty()
  role: string
}