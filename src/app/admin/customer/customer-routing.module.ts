import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerSalesComponent } from './components/customer-sales/customer-sales.component';
// Guardianes
import { AdminGuard } from 'src/app/admin.guard';

const routes: Routes = [
  {
    path: 'customer-list',
    canActivate: [AdminGuard],
    component: CustomerListComponent
  },
  {
    path: 'customer-sales/:idUser',
    canActivate: [AdminGuard],
    component: CustomerSalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
