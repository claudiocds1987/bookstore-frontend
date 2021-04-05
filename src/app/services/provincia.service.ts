import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provincia } from './../models/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  getProvincias() {
    return this.http.get<Provincia[]>(`${this.SERVER}/provincia/provincias`);
  }

}
