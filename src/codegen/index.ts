#!/usr/bin/env node

import { exit } from "process";
import * as fs from 'fs'
import * as path from 'path'
import { kebabCase, camelCase, upperFirst, startCase } from 'lodash';

import service from "./template/service";
import dto from "./template/dto";
import module from "./template/module";
import schema from "./template/schema";
import controller from "./template/controller";
import { plural } from 'pluralize'

export type Name = {
  kebabCase: string;
  upperCamel: string;
  lowerCamel: string;
  kebabCasePlural: string;
  upperCamelPlural: string;
  lowerCamelPlural: string;
  startCase: string;
}

const args = process.argv.slice(2);
const resourceName = args[0]
const dir = args[1] || resourceName

if (!resourceName) {
  console.log('Name must be defined')
  exit()
}

const name: Name = {
  kebabCase: kebabCase(resourceName).toLowerCase(),
  upperCamel: upperFirst(camelCase(resourceName)),
  lowerCamel: camelCase(resourceName),
  kebabCasePlural: plural(kebabCase(resourceName).toLowerCase()),
  upperCamelPlural: plural(upperFirst(camelCase(resourceName))),
  lowerCamelPlural: plural(camelCase(resourceName)),
  startCase: startCase(camelCase(resourceName))
}

if (!fs.existsSync(path.resolve(`src`, dir))) {
  fs.mkdirSync(path.resolve(`src`, dir))
}

fs.writeFileSync(path.resolve(`src`, dir, `${name.kebabCasePlural}.module.ts`), module(name))
fs.writeFileSync(path.resolve(`src`, dir, `${name.kebabCase}.schema.ts`), schema(name))
fs.writeFileSync(path.resolve(`src`, dir, `${name.kebabCasePlural}.service.ts`), service(name))
fs.writeFileSync(path.resolve(`src`, dir, `${name.kebabCase}.dto.ts`), dto(name))
fs.writeFileSync(path.resolve(`src`, dir, `${name.kebabCasePlural}.controller.ts`), controller(name))
