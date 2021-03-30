import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormPurchaseComponent } from './components/form-purchase/form-purchase.component';
import { SuccessfulPurchaseComponent } from './components/successful-purchase/successful-purchase.component';
import { FailedPurchaseComponent } from './components/failed-purchase/failed-purchase.component';
import { PendientPurchaseComponent } from './components/pendient-purchase/pendient-purchase.component';

const routes: Routes = [
  {
    path: 'form-purchase',
    component: FormPurchaseComponent
  },
  {
    path: 'successful-purchase',
    component: SuccessfulPurchaseComponent
  },
  {
    path: 'failed-purchase',
    component: FailedPurchaseComponent
  },
  {
    path: 'pendient-purchase',
    component: PendientPurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
