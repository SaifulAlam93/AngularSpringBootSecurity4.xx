import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../models/api.models';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated) return true;
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const roles = (route.data['roles'] ?? []) as Role[];
  if (auth.hasRole(roles)) return true;
  return inject(Router).createUrlTree([
    auth.isAuthenticated ? '/dashboard' : '/login',
  ]);
};
