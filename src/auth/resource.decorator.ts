import { SetMetadata } from '@nestjs/common';

export const AuthResourceSymbol = Symbol('AuthResource')

export const AuthResource = (resource: string) => SetMetadata(AuthResourceSymbol, resource);