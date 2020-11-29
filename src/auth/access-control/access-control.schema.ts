import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { IsArray, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type AccessControlDocument = AccessControl & Document;

export class Permission {
  @prop()
  @ApiProperty()
  @IsString()
  resource: string;

  @prop({ type: () => [String] })
  @ApiProperty()
  @IsString({ each: true })
  actions: string[];
}

export class AccessControl {
  @prop()
  @ApiProperty()
  @IsString()
  role: string;

  @prop({ type: () => [Permission] })
  @ApiProperty()
  @IsArray({ each: true })
  permissions: Permission[];
}
