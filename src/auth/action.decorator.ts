import { SetMetadata } from '@nestjs/common';

export const AuthActionsSymbol = Symbol('AuthActions')

export const AuthActions = (...actions: string[]) => SetMetadata(AuthActionsSymbol, actions);