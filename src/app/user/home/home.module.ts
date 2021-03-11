import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './../../material/material.module';
import { HomeRoutingModule } from './home-routing.module';
// para los pagination
import { NgxPaginationModule } from 'ngx-pagination';
// imports para el funcionamiento del spinner/loader para peticiones http
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
// -------------------------------------------------------------------------------
import { NgxMaskModule, IConfig } from 'ngx-mask';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgxMaskModule.forRoot()
  ]
})
export class HomeModule { }
