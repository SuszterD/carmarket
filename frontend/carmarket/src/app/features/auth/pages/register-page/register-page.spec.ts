import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from './register-page';
import { Auth } from '../../../../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

const formData = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceMock: { register: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = { register: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: Auth, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
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

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
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
});
