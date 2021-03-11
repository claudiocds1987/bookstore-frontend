import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

const routes: Routes = [
  {
    path: 'create-order',
    component: CreateOrderComponent
  },
  {
    path: 'orders-list',
    component: OrdersListComponent
  },
  {
    path: 'order-detail/:idOrder',
    component: OrderDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
