import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { CrudInjectable } from "../../crud/crud-injectable.decorator";
import { CrudService } from '../../crud/crud.service';
import { AccessControl, AccessControlDocument } from './access-control.schema';
import { CreateAccessControlDto } from './dto/create-access-control.dto';
import { FilterAccessControlDto } from './dto/filter-access-control.dto';
import { UpdateAccessControlDto } from './dto/update-access-control.dto';

@CrudInjectable({
  createDto: CreateAccessControlDto,
  updateDto: UpdateAccessControlDto,
  mongooseModel: AccessControl,
  filterQuery: FilterAccessControlDto
})
export class AccessControlService extends CrudService {
  constructor(@InjectModel(AccessControl) private roleModel: Model<AccessControlDocument>) {
    super(roleModel)
  }

  async checkRole(roles: string[], resource: string, actions: string[]): Promise<boolean> {
    return await this.roleModel.exists({ role: { $in: roles }, 'permissions.resource': resource, 'permissions.actions': { $in: actions } })
  }
}
