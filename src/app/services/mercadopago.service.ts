import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MercadopagoService {
 private SERVER = 'http://localhost:3000/checkout';

 private header = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  // checkout(compra: any) {
  //   return this.http.post(`${this.SERVER}`, compra);
  // }

  checkout(compra: any) {
    return this.http.post('http://localhost:3000/prueba', compra, { headers: this.header });
  }

}
