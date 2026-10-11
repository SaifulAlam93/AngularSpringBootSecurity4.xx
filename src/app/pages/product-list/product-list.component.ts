import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductApiService } from '../../api/product-api.service';
import { ProductDto, Role } from '../../models/api.models';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent  implements OnInit {

  private productApi = inject(ProductApiService);

  private router = inject(Router);

  readonly auth = inject(AuthService);

  canAccess(roles: Role[]): boolean {
    return this.auth.hasRole(roles);
  }

  
  products: ProductDto[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productApi.list().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products/view', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productApi.delete(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: () => alert('Failed to delete product.')
      });
    }
  }
}