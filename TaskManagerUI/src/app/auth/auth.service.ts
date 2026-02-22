// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/register`,
      { email, password },
      {
        withCredentials: true,
      },
    );
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/login`,
      { email, password },
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  me(): Observable<{ email: string }> {
    return this.http.get<{ email: string }>(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }
}
