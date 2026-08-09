import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { Auth } from '../../../../core/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = { login: vi.fn() };

    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [{ provide: Auth, useValue: authServiceMock }, provideRouter([])],
    });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login when form is invalid', () => {
    component.submit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login and navigate to /listings', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.form.setValue({ username: 'testuser', password: 'testpassword' });
    authServiceMock.login.mockReturnValue(of({ access_token: 'fake-token', token_type: 'bearer' }));

    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/listings']);
    expect(authServiceMock.login).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('should show an error message on failed login', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('login failed')));

    component.form.setValue({ username: 'testuser', password: 'testpassword' });
    component.submit();

    expect(component.errorMessage()).toBe('Hibás felhasználónév vagy jelszó');
  });

  it('should link to the register page', () => {
    const link = fixture.nativeElement.querySelector('.auth-footer a');
    expect(link.getAttribute('href')).toBe('/register');
  });
});
