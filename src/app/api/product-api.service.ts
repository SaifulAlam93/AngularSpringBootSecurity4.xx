import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/api/products`;
  list(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(this.url);
  }
  get(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.url}/${id}`);
  }
  getPremium(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.url}/premium`);
  }
  create(product: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.url, product);
  }
  update(id: number, product: ProductDto): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.url}/${id}`, product);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
