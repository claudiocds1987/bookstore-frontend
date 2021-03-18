import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from '../models/orderDetail';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  createOrderDetail(orderDetail: OrderDetail) {
    // return this.http.post(
    //   'http://localhost:4000/ordersDetail/create',
    //   orderDetail
    // );
    return this.http.post(`${this.SERVER}/ordersDetail/create`, orderDetail);
  }

  getOrderDetail(idOrder: number) {
    // return this.http.get<OrderDetail[]>(
    //   'http://localhost:4000/getOrderDetail/' + idOrder
    // );
    return this.http.get<OrderDetail[]>(`${this.SERVER}/getOrderDetail/` + idOrder);
  }
}
