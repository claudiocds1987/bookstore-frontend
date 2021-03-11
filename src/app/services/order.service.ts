import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order){
    return this.http.post('http://localhost:4000/orders/create', order);
  }

  getLastIdOrder() {
    return this.http.get<number>('http://localhost:4000/orders/lastIdOrder');
  }

  // devuelve todas las ordenes de compra de un usuario especifico
  getOrdersByUserId(idUser: number) {
    return this.http.get<Order[]>('http://localhost:4000/orders/getOrdersByUserId/' + idUser);
  }

}
