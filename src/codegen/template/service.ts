import { Name } from "..";

export default (name: Name) => `import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ${name.upperCamel}, ${name.upperCamel}Document } from './${name.lowerCamel}.schema';
import { Create${name.upperCamel}Dto, Update${name.upperCamel}Dto } from './${name.lowerCamel}.dto';
import { CrudInjectable, CrudService, } from '@tsh96/nest-typegoose-crud'

@CrudInjectable({
  createDto: Create${name.upperCamel}Dto,
  updateDto: Update${name.upperCamel}Dto,
  mongooseModel: ${name.upperCamel},
  filterQuery: Update${name.upperCamel}Dto
})
export class ${name.upperCamelPlural}Service extends CrudService {
  constructor(@InjectModel(${name.upperCamel}) ${name.lowerCamel}Model: Model<${name.upperCamel}Document>) {
    super(${name.lowerCamel}Model)
  }
}`