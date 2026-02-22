// auth.interceptor.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly platformId = inject(PLATFORM_ID);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error ${error.status}: ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
