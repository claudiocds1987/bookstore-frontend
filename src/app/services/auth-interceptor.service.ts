import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  // en app.module.ts hay que importar modulos y algunas configuraciones en providers
  constructor(private tokenService: TokenService) {}

  // implements HttpInterceptor me obliga a tener el método Intercept()
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.addToken(request);
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>) {
    const token = this.tokenService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          // en server auth-token
          token,
        },
      });
      return request;
    }
    return request;
  }
}
