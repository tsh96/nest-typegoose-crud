<div align="center">
  <h1>Nest Mongoose Crud</h1>
</div>

# Description

This package provides several decorators and classes for endpoints generation, model validation, and access control

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
yarn add @tsh96/nest-mongoose-crud class-transformer class-validator @nestjs/swagger @nestjs/mongoose mongoose
yarn add -D @types/mongoose
```

Npm

```bash
npm install @tsh96/nest-mongoose-crud class-transformer class-validator @nestjs/swagger @nestjs/mongoose mongoose
npm install @types/mongoose
```

# Getting started

## Codegen

Codegen is a handy tool to generate code for controller, dto, module, schema and service.

```bash
yarn codegen [resource] [path?]
```

For example `yarn codegen cat` will create a files under `src/cat` folder and `yarn codegen puppy d1/d2` will create a files under `src/d1/d2`

## Manually

Create a mongoose schema

```ts
// dog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type DogDocument = Dog & Document;

@Schema()
export class Dog {
  @Prop() // For mongoose
  @ApiProperty() // For swagger
  @IsString() // For class validator
  name: string;

  @Prop() // For mongoose
  @ApiProperty() // For swagger
  @IsNumber() // For class validator
  age: number;

  @Prop() // For mongoose
  @ApiProperty() // For swagger
  @IsString() // For class validator
  breed: string;
}

export const DogSchema = SchemaFactory.createForClass(Dog);
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
import { InjectModel } from '@nestjs/mongoose';
import { Dog, DogDocument } from './dog.schema';
import { CreateDogDto, UpdateDogDto } from './dog.dto';
import { CrudInjectable, CrudService } from 'nest-mongoose-crud';

@CrudInjectable({
  createDto: CreateDogDto,
  updateDto: UpdateDogDto,
  mongooseModel: Dog,
  filterQuery: UpdateDogDto,
}) // For Crud Service
export class DogsService extends CrudService {
  constructor(@InjectModel(Dog.name) dogModel: Model<DogDocument>) {
    super(dogModel);
  }
}
```

Create a controller. Must have **Crud** decorator and extends **CrudController**::

```ts
//dogs.controller.ts
import { ParseArrayPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthResource, Crud, CrudController } from 'nest-mongoose-crud';
import { DogsService } from './dog.service';

@ApiBearerAuth() // For Swagger Api
@AuthResource('dog') // For Access Control (Roles Guard)
@Crud('dogs', { crudService: DogsService, ParseArrayPipe }) // For Crud Controller
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
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './dog.schema';
import { DogsController } from './dogs.controller';
import { DogsService } from './dog.service';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }]),
    JwtAuthModule,
  ],
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
} from 'nest-mongoose-crud';
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
  constructor(@InjectModel(Dog.name) dogModel: Model<DogDocument>) {
    super(dogModel);
  }

  feed() {
    //code here...
  }
}
```
