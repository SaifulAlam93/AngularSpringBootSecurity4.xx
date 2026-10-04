import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Role } from './models/api.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  canAccess(roles: Role[]): boolean {
    return this.auth.hasRole(roles);
  }
  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
