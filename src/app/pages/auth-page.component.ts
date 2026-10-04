import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';
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
  busy = false;
  error = '';
  message = '';
  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    email: [
      '',
      this.signup
        ? [Validators.required, Validators.email, Validators.maxLength(255)]
        : [],
    ],
    firstName: ['', Validators.maxLength(255)],
    lastName: ['', Validators.maxLength(255)],
    password: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(72)],
    ],
  });
  submit(): void {
    if (this.form.invalid || this.busy) return;
    this.busy = true;
    this.error = '';
    this.message = '';
    const value = this.form.getRawValue();
    const request: Observable<unknown> = this.signup
      ? this.auth.register({
          username: value.username,
          password: value.password,
          email: value.email,
          firstName: value.firstName || undefined,
          lastName: value.lastName || undefined,
        })
      : this.auth.login({ username: value.username, password: value.password });
    request.pipe(finalize(() => (this.busy = false))).subscribe({
      next: (result) => {
        if (this.signup) {
          this.message = result as string;
          this.form.patchValue({ password: '' });
        } else {
          void this.router.navigateByUrl(
            this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard',
          );
        }
      },
      error: (err: any) =>
        (this.error =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message ||
              'Unable to complete the request. Check the API connection and try again.'),
    });
  }
}
