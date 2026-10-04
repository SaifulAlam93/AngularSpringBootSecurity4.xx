import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Role,
  UserDto,
} from '../models/api.models';

const USER_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/api/auth`;
  private readonly userState = new BehaviorSubject<UserDto | null>(
    this.readUser(),
  );
  readonly user$ = this.userState.asObservable();

  get currentUser(): UserDto | null {
    return this.userState.value;
  }
  get isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwtToken');
  }
  hasRole(roles: Role[] = []): boolean {
    return roles.some((role) => this.currentUser?.roles.includes(role));
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/signin`, request).pipe(
      tap((response) => {
        sessionStorage.setItem('jwtToken', response.jwtToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
        this.userState.next(response.user);
      }),
    );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(`${this.url}/signup`, request, {
      responseType: 'text',
    });
  }

  logout(): void {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem(USER_KEY);
    this.userState.next(null);
  }

  private readUser(): UserDto | null {
    try {
      return JSON.parse(
        sessionStorage.getItem(USER_KEY) ?? 'null',
      ) as UserDto | null;
    } catch {
      return null;
    }
  }
}
