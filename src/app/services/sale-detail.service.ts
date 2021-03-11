import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleDetail } from '../models/saleDetail';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailService {

  constructor(private http: HttpClient) { }

  createSaleDetail(saleDetail: SaleDetail){
    return this.http.post('http://localhost:4000/salesDetail/create', saleDetail);
  }

  getSaleDetail(id_sale: number){
    return this.http.get<SaleDetail[]>('http://localhost:4000/salesDetail/' + id_sale);
  }

}
