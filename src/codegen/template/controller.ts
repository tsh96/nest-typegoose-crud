import { Name } from '..'

export default (name: Name) => `import { ParseArrayPipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthResource, Crud, CrudController } from '@tsh96/nest-typegoose-crud';
import { ${name.upperCamelPlural}Service } from './${name.lowerCamelPlural}.service';

@ApiBearerAuth()
@AuthResource('${name.lowerCamelPlural}')
@Crud('${name.lowerCamelPlural}', { crudService: ${name.upperCamelPlural}Service, ParseArrayPipe, ParseIntPipe })
export class ${name.upperCamelPlural}Controller extends CrudController<${name.upperCamelPlural}Service, any> {
  constructor(readonly service: ${name.upperCamelPlural}Service) {
    super(service)
  }
}`