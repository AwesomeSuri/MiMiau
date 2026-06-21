import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionId = localStorage.getItem('sessionId') || '';
  const userId = localStorage.getItem('userId') || ''; 

  const modifiedReq = req.clone({
    setHeaders: {
      'sessionid': sessionId,
      'userid': userId
    }
  });

  return next(modifiedReq);
};