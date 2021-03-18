import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleDetail } from '../models/saleDetail';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailService {

  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) { 
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  createSaleDetail(saleDetail: SaleDetail){
    // return this.http.post('http://localhost:4000/salesDetail/create', saleDetail);
    return this.http.post(`${this.SERVER}/salesDetail/create`, saleDetail);
  }

  getSaleDetail(id_sale: number){
    // return this.http.get<SaleDetail[]>('http://localhost:4000/salesDetail/' + id_sale);
    return this.http.get<SaleDetail[]>(`${this.SERVER}/salesDetail/` + id_sale);
  }

}
