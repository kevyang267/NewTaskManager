// auth.interceptor.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();

    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = `Error ${error.status}: ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
