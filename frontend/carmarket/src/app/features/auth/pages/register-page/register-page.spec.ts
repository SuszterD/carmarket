import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from './register-page';
import { Auth } from '../../../../core/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

const formData = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceMock: { register: ReturnType<typeof vi.fn> };

  const messageFor = (id: string): string | null => {
    const field = fixture.nativeElement.querySelector(`#${id}`).closest('.form-field');
    return field.querySelector('.error-message')?.textContent.trim() ?? null;
  };

  beforeEach(() => {
    authServiceMock = { register: vi.fn() };

    TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [{ provide: Auth, useValue: authServiceMock }, provideRouter([])],
    });

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call register when form is invalid', () => {
    component.submit();

    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should register and navigate to /login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.form.setValue(formData);
    authServiceMock.register.mockReturnValue(
      of({
        id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        created_at: '2026-01-01',
      }),
    );

    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(authServiceMock.register).toHaveBeenCalledWith(
      'testuser',
      'testuser@example.com',
      'testpassword',
    );
  });

  it('should show the backend error message when one is provided', () => {
    authServiceMock.register.mockReturnValue(
      throwError(() => ({ error: { detail: 'Username or email already in use' } })),
    );
    component.form.setValue(formData);
    component.submit();

    expect(component.errorMessage()).toBe('Username or email already in use');
  });

  it('should show the fallabck error message on failed registration', () => {
    authServiceMock.register.mockReturnValue(throwError(() => new Error('failed to register')));

    component.form.setValue(formData);
    component.submit();

    expect(component.errorMessage()).toBe('Sikertelen regisztráció');
  });

  it('should link to the login page', () => {
    const link = fixture.nativeElement.querySelector('.auth-footer a');
    expect(link.getAttribute('href')).toBe('/login');
  });

  it('should show a required message for an empty touched field', () => {
    component.submit();
    fixture.detectChanges();

    expect(messageFor('username')).toBe('A mező kitöltése kötelező.');
  });

  it('should show a format message for an invalid email', () => {
    component.form.setValue({ ...formData, email: 'not-an-email' });
    component.submit();
    fixture.detectChanges();

    expect(messageFor('email')).toBe('Érvénytelen email cím.');
  });

  it('should quote the bound in the minlength message', () => {
    component.form.setValue({ ...formData, username: 'abc' });
    component.submit();
    fixture.detectChanges();

    expect(messageFor('username')).toBe('Legalább 6 karakter.');
  });

  it('should show no field messages when the form is valid', () => {
    component.form.setValue(formData);
    component.form.markAllAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.error-message--field').length).toBe(0);
  });
});
