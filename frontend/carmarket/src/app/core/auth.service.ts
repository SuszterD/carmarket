import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiurl = '/api/auth';
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    if (this.isLoggedIn()) {
      this.loadCurrentUser();
      this.scheduleRefresh();
    }
  }

  login(username: string, password: string): Observable<Token> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http
      .post<Token>(`${this.apiurl}/login`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((token) => {
          localStorage.setItem('access_token', token.access_token);
          this.loadCurrentUser();
          this.scheduleRefresh();
        }),
      );
  }

  refresh(): Observable<Token> {
    return this.http.post<Token>(`${this.apiurl}/refresh`, {}).pipe(
      tap((token) => {
        localStorage.setItem('access_token', token.access_token);
        this.scheduleRefresh();
      }),
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiurl}/register`, { username, email, password });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiurl}/me`);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.clearRefreshTimer();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private loadCurrentUser(): void {
    this.getCurrentUser().subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: (err) => {
        console.error('Failed to load current user, logging out', err);
        this.logout();
        this.router.navigate(['/listings']);
      },
    });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private scheduleRefresh(): void {
    this.clearRefreshTimer();

    const token = this.getToken();
    if (!token) {
      return;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const msUntilRefresh = exp * 1000 - Date.now() - 20_000;

      if (msUntilRefresh <= 0) {
        return;
      }

      this.refreshTimeoutId = setTimeout(() => {
        this.refresh().subscribe({
          error: () => this.logout(),
        });
      }, msUntilRefresh);
    } catch (err) {
      console.error('Could not schedule token refresh — session will expire', err);
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimeoutId !== null) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  }
}
