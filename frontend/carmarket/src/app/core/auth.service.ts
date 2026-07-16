import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.loadCurrentUser();
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
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private loadCurrentUser(): void {
    this.getCurrentUser().subscribe((user) => this.currentUserSubject.next(user));
  }
}
