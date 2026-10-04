import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly signup = this.route.snapshot.data['mode'] === 'signup';
 // if login then false or for signup then true 
  busy = false;
  error = '';
  message = '';
  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    email: [
      '',
      this.signup? [Validators.required, Validators.email, Validators.maxLength(255)]
        : [],
    ],
    firstName: ['', Validators.maxLength(255)],
    lastName: ['', Validators.maxLength(255)],
    // The backend accepts passwords from 8 to 72 characters.
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(72)]],
  });

  submit(): void {
    if (this.form.invalid || this.busy) return;

    this.busy = true;
    this.error = '';
    this.message = '';

    if (this.signup) {
      this.registerAccount();
    } else {
      this.signIn();
    }
  }

  private registerAccount(): void {
    const values = this.form.getRawValue();

    this.auth.register({
      username: values.username,
      password: values.password,
      email: values.email,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
    }).subscribe({
      next: (successMessage) => {
        this.message = successMessage;
        this.busy = false;
        this.form.controls.password.reset();
      },
      error: (error: HttpErrorResponse) => this.showError(error),
    });
  }

  private signIn(): void {
    const values = this.form.getRawValue();

    this.auth.login({
      username: values.username,
      password: values.password,
    }).subscribe({
      next: () => {
        this.busy = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl || '/dashboard');
      },
      error: (error: HttpErrorResponse) => this.showError(error),
    });
  }

  private showError(error: HttpErrorResponse): void {
    this.error = typeof error?.error === 'string'
      ? error.error
      : error?.error?.message || 'Unable to complete the request. Check the API connection and try again.';
    this.busy = false;
  }
}
