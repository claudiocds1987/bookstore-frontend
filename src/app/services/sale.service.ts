import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  createSale(sale: Sale){
    // return this.http.post('http://localhost:3000/sales/create', sale);
    return this.http.post(`${this.SERVER}/sales/create`, sale);
  }

  getLastIdSale() {
    return this.http.get<number>(`${this.SERVER}/sales/lastIdSale`);
  }

  getSalesByCustomerId(id: number){
    return this.http.get<Sale[]>(`${this.SERVER}/sales/customer/` + id);
  }

  // devuelve la "cantidad de ventas" del año y mes elegidos.
  countSalesFromMonth(year: number, month: number){
    return this.http.get<any[]>(`${this.SERVER}/sales/countFromMonth/${year}/${month}`);
  }

  // devuelve la "cantidad de ventas" de un año particular.
  countSalesFromYear(year: number){
    return this.http.get<any[]>(`${this.SERVER}/sales/countFromYear/${year}`);
  }

  // devuelve la "recaudacion total" del año y mes elegidos.
  salesRevenueByYearAndMonth(year: number, month: number){
    return this.http.get<any[]>(`${this.SERVER}/sales/revenueByYearAndMonth/${year}/${month}`);
  }

  // devuelve la "recaudacion total" de un año particular.
  salesRevenueFromYear(year: number){
    return this.http.get<any[]>(`${this.SERVER}/sales/revenueFromYear/${year}`);
  }

  // devuelve 10 o menos (dependiendo del resultado) libros mas vendidos cuya cantidad de ventas es igual o superior a 5.
  getBookTopSales(){
    // return this.http.get<any[]>('http://localhost:4000/sales/bookTopSales');
    return this.http.get<any[]>(`${this.SERVER}/sales/bookTopSales`);
  }

  // devuelve la recaudacion total de hasta 5 provincias (de la tabla orders)
  getProvinciasTopSales(){
    return this.http.get<any[]>(`${this.SERVER}/sales/provinciasTopSales`);
  }

  // devuelve el monto total de ventas de cada mes de un año particular
  getAnnualSales(year: number){
    // return this.http.get<any[]>(`http://localhost:4000/sales/annualSales/${year}`);
    return this.http.get<any[]>(`${this.SERVER}/sales/annualSales/${year}`);
  }

  // devuelve el promedio de ventas de un año particular
  getAverageAnnualSales(year: number){
    // return this.http.get<any[]>(`http://localhost:4000/sales/averageAnnualSales/${year}`);
    return this.http.get<any[]>(`${this.SERVER}/sales/averageAnnualSales/${year}`);
  }

}
