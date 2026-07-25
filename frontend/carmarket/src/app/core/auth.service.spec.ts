import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  function loginAsTestUser() {
    service.login('testuser', 'testpassword').subscribe();

    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ access_token: 'fake-token', token_type: 'bearer' });

    const meReq = httpMock.expectOne('/api/auth/me');
    meReq.flush({
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      created_at: '2026-01-01',
    });

    return { loginReq, meReq };
  }

  function createFakeToken(expiresInSeconds: number): string {
    const payload = { exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
    const encodedPayload = btoa(JSON.stringify(payload));

    return `header.${encodedPayload}.signature`;
  }

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should store the token and load the user on successful login', () => {
    const { loginReq } = loginAsTestUser();

    service.currentUser$.subscribe((user) => {
      expect(user?.username).toBe('testuser');
    });

    expect(loginReq.request.method).toBe('POST');
    expect(localStorage.getItem('access_token')).toBe('fake-token');
  });

  it('should not store a token on failed login', () => {
    service.login('testuser', 'testpassword').subscribe({
      error: () => [],
    });

    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush(
      { detail: 'Incorrect username or password' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should register a user', () => {
    service.register('testuser', 'testuser@example.com', 'testpassword').subscribe();

    const registerReq = httpMock.expectOne('/api/auth/register');
    expect(registerReq.request.method).toBe('POST');
    expect(registerReq.request.body).toEqual({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    });
    registerReq.flush({
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      created_at: '2026-01-01',
    });
  });

  it('should clear token and reset current user on logout', () => {
    loginAsTestUser();

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();

    service.currentUser$.subscribe((user) => {
      expect(user).toBeNull();
    });
  });

  it('should return true for a valid non-expired token', () => {
    localStorage.setItem('access_token', createFakeToken(3600));

    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false when no token exists', () => {
    localStorage.removeItem('access_token');

    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return false for an expired token', () => {
    localStorage.setItem('access_token', createFakeToken(-1));

    expect(service.isLoggedIn()).toBe(false);
  });

  it('should store the new token on successful refresh', () => {
    localStorage.setItem('access_token', 'old-fake-token');

    service.refresh().subscribe();

    const refreshReq = httpMock.expectOne('/api/auth/refresh');
    expect(refreshReq.request.method).toBe('POST');
    refreshReq.flush({ access_token: 'new-fake-token', token_type: 'bearer' });

    expect(localStorage.getItem('access_token')).toBe('new-fake-token');
  });
});
