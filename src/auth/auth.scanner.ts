import { Type } from "@nestjs/common";
import { MetadataScanner, NestContainer, Reflector } from "@nestjs/core";
import { DependenciesScanner } from "@nestjs/core/scanner";
import { AuthActionsSymbol } from "./action.decorator";
import { AuthResourceSymbol } from "./resource.decorator";

export class AuthScanner {
  container: NestContainer;
  metaScanner: MetadataScanner;
  scanner: DependenciesScanner;

  constructor() {
    this.container = new NestContainer();
    this.metaScanner = new MetadataScanner()
    this.scanner = new DependenciesScanner(this.container, this.metaScanner)
  }

  async scan(module: Type<any>) {
    const reflector = new Reflector();
    const result: AuthScannerResult = []

    await this.scanner.scan(module);

    this.container.getModules().forEach(module => {
      module.controllers.forEach(controller => {
        const controllerClass = controller.createPrototype(null);
        let proto = controllerClass.constructor.prototype;
        const resource = reflector.get<string>(AuthResourceSymbol, controller.metatype)
        const actions = []
        do {
          Object.getOwnPropertyNames(proto).forEach(prop => {
            if (proto[prop] instanceof Function) {
              actions.push(...(reflector.get<string[]>(AuthActionsSymbol, proto[prop]) || []))
            }
          })
        } while (proto = Object.getPrototypeOf(proto));

        if (resource && actions.length) {
          result.push({ resource, actions: Array.from(new Set(actions)) })
        }
      })
    })
    return result
  }
}

export type AuthScannerResult = {
  resource: string,
  actions: string[]
}[]