import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  createOrder(order: Order) {
    return this.http.post(`${this.SERVER}/orders/create`, order);
  }

  getLastIdOrder() {
    return this.http.get<number>(`${this.SERVER}/orders/lastIdOrder`);
  }

  // devuelve todas las ordenes de compra de un usuario especifico
  getOrdersByUserId(idUser: number) {
    return this.http.get<Order[]>(
      `${this.SERVER}/orders/getOrdersByUserId/` + idUser
    );
  }
}
