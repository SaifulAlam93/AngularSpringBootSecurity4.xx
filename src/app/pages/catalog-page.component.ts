import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../api/product-api.service';
import { ProductDto } from '../models/api.models';

@Component({standalone: true, imports: [CurrencyPipe, RouterLink, NgIf], templateUrl: './catalog-page.component.html', styleUrl: './catalog-page.component.scss'})
export class CatalogPageComponent implements OnInit {
  private readonly api = inject(ProductApiService); products: ProductDto[] = []; error = ''; loaded = false;
  ngOnInit(): void { this.api.list().subscribe({ next: data => { this.products = data; this.loaded = true; }, error: () => { this.error = 'We could not reach the product catalog. Make sure the Spring Boot API is running on localhost:8080.'; this.loaded = true; } }); }
}
