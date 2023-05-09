import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionName: string) {}

  private client: PrismaClient = new PrismaClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.permissionName;

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    if (!userId) {
      return false;
    }

    const user = await this.client.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { permissions: true } } },
    });

    const userRoles = user.roles;
    if (!userRoles) {
      return false;
    }

    const hasPermission = userRoles.some((role) =>
      role.permissions.some(
        (permission) => permission.name === requiredPermission,
      ),
    );

    // console.log(requiredPermission);

    return hasPermission;
  }
}
