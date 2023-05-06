import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Check if the user is authenticated and has a valid access token
    if (!super.canActivate(context)) {
      return false;
    }

    // Check if the access token is valid for this particular action
    const requiredScopes = ['read:resource'];
    const accessTokenScopes = request.user.scope.split(' ');

    if (!requiredScopes.every((scope) => accessTokenScopes.includes(scope))) {
      return false;
    }

    // Check if the user has the required permission for this particular action
    const requiredPermission = 'readResource';
    const userRoles = request.user.roles;

    if (
      !userRoles.some((role: any) =>
        role.permissions.some(
          (permission: any) => permission.name === requiredPermission,
        ),
      )
    ) {
      return false;
    }

    return true;
  }
}
