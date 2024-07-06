import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    // Get the auth token from local storage or another secure storage
    const authToken = localStorage.getItem('token');

    // Clone the request and add the authorization header if the token is present
    const authReq = authToken ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    }) : req;

    // Send the cloned request with the new header to the next handler.
    return next(authReq);

    
  }
}

// Export the interceptor as a function
export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authInterceptor = new AuthInterceptor();
  return authInterceptor.intercept(req, next);
};
