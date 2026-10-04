import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminStatisticsDto, Role, UserDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/api`;
  list(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.url}/users`);
  }
  get(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${this.url}/users/${encodeURIComponent(username)}`,
    );
  }
  update(
    username: string,
    body: { firstName?: string; lastName?: string; email?: string },
  ): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${this.url}/users/${encodeURIComponent(username)}`,
      body,
    );
  }
  delete(username: string): Observable<string> {
    return this.http.delete(
      `${this.url}/users/${encodeURIComponent(username)}`,
      { responseType: 'text' },
    );
  }
  setEnabled(username: string, enabled: boolean): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${this.url}/users/${encodeURIComponent(username)}/status`,
      { enabled },
    );
  }
  roles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/admin/roles`);
  }
  setRoles(username: string, roles: Role[]): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${this.url}/admin/users/${encodeURIComponent(username)}/roles`,
      { roles },
    );
  }
  usersWithRole(role: Role): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.url}/admin/roles/${role}/users`);
  }
  statistics(): Observable<AdminStatisticsDto> {
    return this.http.get<AdminStatisticsDto>(`${this.url}/admin/statistics`);
  }
}
