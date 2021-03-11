import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerService: NgxSpinnerService) { }

  public showSpinner(){
    // muestra el spinner/loader
    this.spinnerService.show();
  }

  public stopSpinner(){
    // stop del spinner/loader
    this.spinnerService.hide();
  }

}
