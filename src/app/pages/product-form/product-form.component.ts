import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductApiService } from '../../api/product-api.service';
import { ProductDto } from '../../models/api.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent  implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productApi = inject(ProductApiService);

  id?: number;
  isEdit = false;
  loading = false;
  saving = false;
  error = '';

  productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    stock: [0, [Validators.required, Validators.min(0)]],
    active: [true],
    premium: [false],
    imageUrl: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = Number(id);
      this.isEdit = true;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;

    this.productApi.get(this.id!).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description ?? '',
          stock: product.stock,
          active: product.active ?? true,
          premium: product.premium ?? false,
          imageUrl: product.imageUrl ?? ''
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: ProductDto = this.productForm.getRawValue();

    this.saving = true;
    this.error = '';

    const request = this.isEdit
      ? this.productApi.update(this.id!, product)
      : this.productApi.create(product);

    request.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error = 'Failed to save product.';
        this.saving = false;
      }
    });
  }
}