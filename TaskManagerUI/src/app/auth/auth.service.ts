// auth.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/register`, { email, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}
