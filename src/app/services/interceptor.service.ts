import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private spinnerService: SpinnerService)
    { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Otra forma de crear el interceptor:
    // En mi caso guardo el token en localstorage porque lo crea mi API en Node/express con JWT
    const token = localStorage.getItem('token');

    if (!token) {
      return next.handle(req);
    }

    const req1 = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    // En cada solicitud HTTP se va a mostrar el spinner/loader
    this.spinnerService.showSpinner();
    return next.handle(req1).pipe(
      // cuando finalize la petición http (termine de traer los datos) que desaparezca el spinner/loader
      finalize(() => this.spinnerService.stopSpinner())
    );

    //----------------(old version)-------------------------------------------------------
    // En cada solicitud HTTP se va a mostrar el spinner/loader 
    // this.spinnerService.showSpinner();
    // return next.handle(req).pipe(
    //   // cuando finalize la petición http (termine de traer los datos) que desaparezca el spinner/loader
    //   finalize(() => this.spinnerService.stopSpinner())
    // );
    
  }
}
