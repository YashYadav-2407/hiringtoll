import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  const shouldAttachToken = req.url.startsWith('/api') || req.url.includes('hiringtoll.onrender.com');

  if (!shouldAttachToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
