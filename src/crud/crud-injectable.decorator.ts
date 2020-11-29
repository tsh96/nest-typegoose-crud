import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import {
  CREATE_DTO,
  CREATE_RESPONSE,
  FIND_BY_ID_RESPONSE,
  FIND_MANY_FILTER,
  FIND_MANY_RESPONSE,
  UPDATE_DTO,
  UPDATE_ONE_RESPONSE,
  UPDATE_MANY_FILTER,
  UPDATE_MANY_RESPONSE,
  DELETE_BY_ID_RESPONSE,
  DELETE_MANY_RESPONSE,
  FIND_MANY_SELECT_ENUM,
} from '../constants'


export function CrudInjectable(
  { createDto, updateDto, mongooseModel, filterQuery }: CrudServiceOptions
): ClassDecorator {
  return (crudService) => {
    const model = mongooseModel.name;
    const classes = {
      [model]: class extends mongooseModel { },
    };
    ApiProperty({ type: String })(classes[model].prototype, '_id');

    const apiModelPropertiesArray: string[] | null = Reflect.getMetadata('swagger/apiModelPropertiesArray', mongooseModel.prototype);
    const findManySelectEnum = apiModelPropertiesArray ? ['_id', ...apiModelPropertiesArray?.map(property => property.match(/:(.*)/)?.[1])] : ['_id'];

    const createOneResponse = classes[model];
    const deleteByIdResponse = DeleteByIdResponse;
    const deleteManyResponse = DeleteManyResponse;
    const findByIdResponse = classes[model];
    const findManyFilter = filterQuery;
    const findManyResponse = classes[model];
    const updateManyFilter = filterQuery;
    const updateManyResponse = UpdateManyResponse;
    const updateOneResponse = UpdateOneResponse;


    Reflect.defineMetadata(CREATE_DTO, createDto, crudService);
    Reflect.defineMetadata(CREATE_RESPONSE, createOneResponse, crudService);

    Reflect.defineMetadata(FIND_BY_ID_RESPONSE, findByIdResponse, crudService);
    Reflect.defineMetadata(FIND_MANY_FILTER, findManyFilter, crudService);
    Reflect.defineMetadata(FIND_MANY_RESPONSE, findManyResponse, crudService);

    Reflect.defineMetadata(UPDATE_DTO, updateDto, crudService);
    Reflect.defineMetadata(UPDATE_ONE_RESPONSE, updateOneResponse, crudService);
    Reflect.defineMetadata(UPDATE_MANY_FILTER, updateManyFilter, crudService);
    Reflect.defineMetadata(UPDATE_MANY_RESPONSE, updateManyResponse, crudService);

    Reflect.defineMetadata(DELETE_BY_ID_RESPONSE, deleteByIdResponse, crudService);
    Reflect.defineMetadata(DELETE_MANY_RESPONSE, deleteManyResponse, crudService);
    Reflect.defineMetadata(FIND_MANY_SELECT_ENUM, findManySelectEnum, crudService);

    Injectable()(crudService);
  };
}
type CrudServiceOptions = {
  createDto: new () => any;
  updateDto: new () => any;
  filterQuery: new () => any;
  mongooseModel: new () => any;
};

export class DeleteByIdResponse {
}

export class DeleteManyResponse {
}

export class UpdateManyResponse {
}

export class UpdateOneResponse {
  @ApiProperty()
  n: number;

  @ApiProperty()
  nModified: number;

  @ApiProperty()
  ok: 0 | 1;
}
