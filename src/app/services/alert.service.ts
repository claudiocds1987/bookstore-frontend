import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) {}

  showSuccess(texto, titulo) {
    this.toastr.success(texto, titulo, {
      timeOut: 2500, // duracion del alerta
      progressBar: true, // barra que indica la duracion del alerta
    });
  }

  showError(texto, titulo) {
    this.toastr.error(texto, titulo, {
      timeOut: 3500,
      progressBar: true,
    });
  }

  showWarning(texto, titulo) {
    this.toastr.warning(texto, titulo, {
      timeOut: 2500, // duracion del alerta
      progressBar: true, // barra que indica la duracion del alerta
      //progressAnimation: 'increasing', // la barra aumenta de forma creciente hasta desaparecer el alert
      //positionClass: 'toast-top-left' // position del alerta, por default aparece a al derecha
    }); 
  }

  showInfo(texto, titulo) {
    this.toastr.info(texto, titulo, {
      timeOut: 2500, // duracion del alerta
      progressBar: true, // barra que indica la duracion del alerta
    });
  }

  

}
