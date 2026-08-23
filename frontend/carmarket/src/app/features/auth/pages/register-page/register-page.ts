import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  form!: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    this.authService
      .register(this.form.value.username, this.form.value.email, this.form.value.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (typeof err.error?.detail === 'string') {
            this.errorMessage.set(err.error.detail);
          } else {
            this.errorMessage.set('Sikertelen regisztráció');
          }
        },
      });
  }

  errorFor(field: string): string | null {
    const control = this.form.get(field);
    if (!control || control.valid || !control.touched) return null;

    const errors = control.errors ?? {};
    if (errors['required']) return 'A mező kitöltése kötelező.';
    if (errors['email']) return 'Érvénytelen email cím.';
    if (errors['minlength']) return `Legalább ${errors['minlength'].requiredLength} karakter.`;
    if (errors['maxlength']) return `Legfeljebb ${errors['maxlength'].requiredLength} karakter.`;
    return null;
  }
}
