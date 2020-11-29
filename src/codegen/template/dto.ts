import { Name } from ".."

export default (name: Name) => `import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { ${name.upperCamel} } from "./${name.lowerCamel}.schema";

export class Create${name.upperCamel}Dto extends ${name.upperCamel} {
  @ApiProperty()
  @IsString()
  name: string;
}

export class Update${name.upperCamel}Dto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
`