import { Name } from "..";

export default (name: Name) => `import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export type ${name.upperCamel}Document = ${name.upperCamel} & Document;

export class ${name.upperCamel} {
  @ApiProperty()
  @prop()
  @IsString()
  name: string;
}
`