import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from '../models/orderDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private http: HttpClient) { }

  createOrderDetail(orderDetail: OrderDetail){
    return this.http.post('http://localhost:4000/ordersDetail/create', orderDetail);
  }

  getOrderDetail(idOrder: number){
    return this.http.get<OrderDetail[]>('http://localhost:4000/getOrderDetail/' + idOrder);
  }
}
