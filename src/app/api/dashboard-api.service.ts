import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  get(kind: DashboardDto['dashboard']): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(
      `${environment.apiBaseUrl}/api/dashboard/${kind}`,
    );
  }
}
