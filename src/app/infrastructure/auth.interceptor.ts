import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    const reqAuth = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
    return next(reqAuth);
  }

  return next(req);
};
