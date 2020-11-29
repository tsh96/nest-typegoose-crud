import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessControlService } from './access-control/access-control.service';
import { AuthActionsSymbol } from './action.decorator';
import { AuthResourceSymbol } from './resource.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AccessControlService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = request.user?.roles;
    const resource = this.reflector.get<string>(AuthResourceSymbol, context.getClass())
    const actions = this.reflector.get<string[]>(AuthActionsSymbol, context.getHandler())

    if (!resource || !actions?.length) return true
    if (!roles?.length) return false

    return this.authService.checkRole(roles, resource, actions);
  }
}
