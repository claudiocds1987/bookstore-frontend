import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { FormPurchaseComponent } from './components/form-purchase/form-purchase.component';
import { SuccessfulPurchaseComponent } from './components/successful-purchase/successful-purchase.component';
import { FailedPurchaseComponent } from './components/failed-purchase/failed-purchase.component';
import { PendientPurchaseComponent } from './components/pendient-purchase/pendient-purchase.component';
import { NgxPaginationModule } from 'ngx-pagination'; // para los pagination
// imports para el funcionamiento del spinner/loader para peticiones http
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    FormPurchaseComponent, 
    SuccessfulPurchaseComponent, 
    FailedPurchaseComponent, 
    PendientPurchaseComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule,
    NgxMaskModule.forRoot()
  ]
})
export class PurchaseModule { }
