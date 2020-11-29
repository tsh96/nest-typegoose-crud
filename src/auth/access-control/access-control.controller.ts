import { ParseArrayPipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CrudController } from '../../crud/crud.controller';
import { Crud } from '../../crud/crud.decorator';
import { AuthResource } from '../resource.decorator';
import { AccessControlService } from './access-control.service';
import { FilterAccessControlDto } from './dto/filter-access-control.dto';

@ApiBearerAuth()
@AuthResource('access-control')
@Crud('access-control', { crudService: AccessControlService, ParseArrayPipe, ParseIntPipe })
export class AccessControlController extends CrudController<AccessControlService, FilterAccessControlDto>{
  constructor(readonly service: AccessControlService) {
    super(service)
  }
}
