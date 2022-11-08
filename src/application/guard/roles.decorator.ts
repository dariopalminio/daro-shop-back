import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to be used in controllers to indicate the permissions (role) associated with each route in controller.
 * @Roles('admin', 'manage-account', 'user', 'app')
 * @param roles 
 * @returns 
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

