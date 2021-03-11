import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { NgxPaginationModule } from 'ngx-pagination'; // para los pagination
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import {MatTableModule} from '@angular/material/table';
import { CustomerSalesComponent } from './components/customer-sales/customer-sales.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerSalesComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MaterialModule,
    MatTableModule
  ]
})
export class CustomerModule { }
