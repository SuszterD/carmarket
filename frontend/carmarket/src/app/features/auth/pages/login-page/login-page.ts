import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  form!: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    this.authService.login(this.form.value.username, this.form.value.password).subscribe({
      next: () => {
        this.router.navigate(['/listings']);
      },
      error: () => {
        this.errorMessage.set('Hibás felhasználónév vagy jelszó');
      },
    });
  }
}
