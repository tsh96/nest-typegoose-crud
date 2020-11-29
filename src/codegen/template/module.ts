import { Name } from "..";

export default (name: Name) => `import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ${name.upperCamel} } from './${name.lowerCamel}.schema';
import { ${name.upperCamelPlural}Controller } from './${name.lowerCamelPlural}.controller';
import { ${name.upperCamelPlural}Service } from './${name.lowerCamelPlural}.service';

@Module({
  imports: [
    TypegooseModule.forFeature([${name.upperCamel}]),
  ],
  controllers: [${name.upperCamelPlural}Controller],
  providers: [${name.upperCamelPlural}Service],
})
export class ${name.upperCamelPlural}Module { }`