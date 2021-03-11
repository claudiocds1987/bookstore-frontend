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
    // En cada solicitud HTTP se va a mostrar el spinner/loader
    this.spinnerService.showSpinner();
    return next.handle(req).pipe(
      // cuando finalize la petición http (termine de traer los datos) que desaparezca el spinner/loader
      finalize(() => this.spinnerService.stopSpinner())
    );
  }
}
