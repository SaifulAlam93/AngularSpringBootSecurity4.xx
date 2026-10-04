import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './auth/auth.guard';
import { AuthPageComponent } from './pages/auth-page.component';
import { CatalogPageComponent } from './pages/catalog-page.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';

export const routes: Routes = [
  { path: '', component: CatalogPageComponent },
  { path: 'login', component: AuthPageComponent, data: { mode: 'login' } },
  { path: 'signup', component: AuthPageComponent, data: { mode: 'signup' } },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/moderator',
    component: DashboardPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { dashboard: 'moderator', roles: ['ROLE_MODERATOR', 'ROLE_ADMIN'] },
  },
  {
    path: 'dashboard/admin',
    component: DashboardPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { dashboard: 'admin', roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'dashboard/premium',
    component: DashboardPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { dashboard: 'premium', roles: ['ROLE_PREMIUM_USER'] },
  },
  { path: '**', redirectTo: '' },
];
