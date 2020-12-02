<div align="center">
  <h1>Nest Typegoose Crud</h1>
</div>

# Description

This package provides several decorators and classes for endpoints generation, model validation, and access control
If you are looking for mongoose version, please move to [@tsh96/nest-mongoose-crud](https://github.com/tsh96/nest-mongoose-crud)

# Features

- Super easy to install and start using the full-featured controllers and services.
- DB and service agnostic extendable CRUD controllers.
- Reach query parsing with filtering, pagination, and sorting.
- Query, path params and DTOs validation included.
- Overriding or inherit controller methods with ease
- Tiny config
- Swagger documentation
- Code Generator

# Install

Create a new nestjs project and install following dependencies.

Yarn (Recommended)

```bash
yarn add @tsh96/nest-typegoose-crud class-transformer class-validator @nestjs/swagger @typegoose/typegoose nestjs-typegoose
```

Npm

```bash
npm install @tsh96/nest-typegoose-crud class-transformer class-validator @nestjs/swagger @typegoose/typegoose nestjs-typegoose
```

# Getting started

## Codegen

Codegen is a handy tool to generate code for controller, dto, module, schema and service.

```bash
yarn codegen [resource] [path?]
```

For example `yarn codegen cat` will create a files under `src/cat` folder and `yarn codegen puppy d1/d2` will create a files under `src/d1/d2`

## Manually

Create a typegoose schema

```ts
// dog.schema.ts
import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type DogDocument = Dog & Document;

@Schema()
export class Dog {
  @prop() // For typegoose
  @ApiProperty() // For swagger
  @IsString() // For class validator
  name: string;

  @prop() // For typegoose
  @ApiProperty() // For swagger
  @IsNumber() // For class validator
  age: number;

  @prop() // For typegoose
  @ApiProperty() // For swagger
  @IsString() // For class validator
  breed: string;
}
```

Create Dto(s) for services:

```ts
//dog.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Dog } from './dog.schema';

export class CreateDogDto extends Dog {
  @ApiProperty() // For swagger
  @IsString() // For class validator
  name: string;

  @ApiProperty() // For swagger
  @IsNumber() // For class validator
  age: number;

  @ApiProperty() // For swagger
  @IsString() // For class validator
  breed: string;
}

export class UpdateDogDto {
  @ApiProperty({ required: false }) // For swagger
  @IsString() // For class validator
  @IsOptional() // For class validator
  name?: string;

  @ApiProperty({ required: false }) // For swagger
  @IsNumber() // For class validator
  @IsOptional() // For class validator
  age?: number;

  @ApiProperty({ required: false }) // For swagger
  @IsString() // For class validator
  @IsOptional() // For class validator
  breed?: string;
}
```

Then create a crud service. Must have **CrudInjectable** decorator and extends **CrudService**:

```ts
//dog.service.ts
import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Dog, DogDocument } from './dog.schema';
import { CreateDogDto, UpdateDogDto } from './dog.dto';
import { CrudInjectable, CrudService } from '@tsh96/nest-typegoose-crud';

@CrudInjectable({
  createDto: CreateDogDto,
  updateDto: UpdateDogDto,
  mongooseModel: Dog,
  filterQuery: UpdateDogDto,
})
export class DogsService extends CrudService {
  constructor(@InjectModel(Dog) dogModel: Model<DogDocument>) {
    super(dogModel);
  }
}
```

Create a controller. Must have **Crud** decorator and extends **CrudController**::

```ts
//dogs.controller.ts
import { ParseArrayPipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthResource, Crud, CrudController } from '@tsh96/nest-typegoose-crud';
import { DogsService } from './dogs.service';

@ApiBearerAuth()
@AuthResource('dogs')
@Crud('dogs', { crudService: DogsService, ParseArrayPipe, ParseIntPipe })
export class DogsController extends CrudController<DogsService, any> {
  constructor(readonly service: DogsService) {
    super(service);
  }
}
```

Connect controller and service with a module

```ts
//dogs.module.ts
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Dog } from './dog.schema';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';

@Module({
  imports: [TypegooseModule.forFeature([Dog])],
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
```

BINGO!

# API endpoints

| Action | One                   | Bulk                                    |
| ------ | --------------------- | --------------------------------------- |
| Create | `POST /dogs`          | `POST /dogs/bulk`                       |
| Read   | `GET /dogs/:dogId`    | `GET /dogs`                             |
| Update | `PUT /dogs/:dogId`    | `PUT /dogs` requiredParam(`filter`)     |
| Delete | `DELETE /dogs/:dogId` | `DELETE /dogs` requiredBody(`[...ids]`) |

# Access Control

`@AuthResource` and `@AuthActions` decorators are worked together to define permissions for each endpoint.
`@AuthResource` is used on controllers and `@AuthActions` is used on actions (methods).
For example

```ts
//dogs.controller.ts
import { ParseArrayPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  AuthResource,
  AuthActions,
  Crud,
  CrudController,
} from 'nest-typegoose-crud';
import { DogsService } from './dog.service';

@ApiBearerAuth() // For Swagger Api
@AuthResource('dog') // For Access Control (Roles Guard)
@Crud('dogs', { crudService: DogsService, ParseArrayPipe }) // For Crud Controller
export class DogsController extends CrudController<DogsService, any> {
  constructor(readonly service: DogsService) {
    super(service);
  }

  @Patch('feed')
  @AuthActions('Feed')
  // @AuthActions('FeedOne', 'FeedMany')  it also can be multiple
  feed() {
    // code here
  }
}
```

Some basic actions are included in the crud actions:

| Action | One                       | Bulk         |
| ------ | ------------------------- | ------------ |
| Create | `CreateOne`, `CreateMany` | `CreateMany` |
| Read   | `ReadOne`, `ReadMany`     | `ReadMany`   |
| Update | `UpdateOne`, `UpdateMany` | `UpdateMany` |
| Delete | `DeleteOne`, `DeleteMany` | `DeleteMany` |

# Override/Inheritance

You can override or inherit controllers as below:

```ts
//imports ...
@ApiBearerAuth() // For Swagger Api
@AuthResource('dog') // For Access Control (Roles Guard)
@Crud('dogs', { crudService: DogsService, ParseArrayPipe }) // For Crud Controller
export class DogsController extends CrudController<DogsService, any> {
  constructor(readonly service: DogsService) {
    super(service);
  }

  @Post()
  @AuthActions('CreateOne')
  ApiOkResponse({ type: CreateOneResponse });
  createOne(@Body() body: CreateDogDto) {
    // code here...
    return super(body); //inherit (optional)
  }
}
```

Here are the method names for respective action.

| Action | One          | Bulk         |
| ------ | ------------ | ------------ |
| Create | `createOne`  | `createMany` |
| Read   | `findById`   | `findMany`   |
| Update | `updateById` | `updateMany` |
| Delete | `deleteById` | `deleteMany` |

Services also:

```ts
//imports ...

@CrudInjectable({
  createDto: CreateDogDto,
  updateDto: UpdateDogDto,
  mongooseModel: Dog,
  filterQuery: UpdateDogDto,
}) // For Crud Service
export class DogsService extends CrudService {
  constructor(@InjectModel(Dog) dogModel: Model<DogDocument>) {
    super(dogModel);
  }

  feed() {
    //code here...
  }
}
```
