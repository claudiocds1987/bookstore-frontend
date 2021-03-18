import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Editorial } from '../models/editoral';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  // URL_API = 'http://localhost:4000/editorials';
  SERVER = 'http://localhost:3000';

  // objeto de tipo editorial
  editorialSelected: Editorial = {
    id_editorial: 0,
    name: '',
  };

  editorialArray: Editorial[]; // array de tipo editorial

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  existEditorialByName(name: string) {
    // devuelve true/false
    // return this.http.get('http://localhost:4000/editorials/exist/' + name);
    return this.http.get(`${this.SERVER}/editorials/exist/` + name);
  }

  createEditorial(editorial: Editorial) {
    // return this.http.post('http://localhost:4000/createEditorial', editorial);
    return this.http.post(`${this.SERVER}/createEditorial`, editorial);
  }

  updateEditorial(editorial: Editorial) {
    // return this.http.put(
    //   'http://localhost:4000/editorials/update/id',
    //   editorial
    // );
    return this.http.put(`${this.SERVER}/editorials/update/id`, editorial);
  }

  getEditorials() {
    // return this.http.get<Editorial[]>(this.URL_API);
    return this.http.get<Editorial[]>(`${this.SERVER}/editorials`);
  }

  getEditorialById(id: string): Observable<Editorial> {
    // return this.http.get<Editorial>(`${this.URL_API}/${id}`);
    return this.http.get<Editorial>(`${this.SERVER}/editorials/${id}`);
  }

  getEditorialByName(name: string) {
    // return this.http.get<Editorial[]>(
    //   'http://localhost:4000/editorials/name/' + name
    // );
    return this.http.get<Editorial[]>(`${this.SERVER}/editorials/name/` + name);
  }
}
