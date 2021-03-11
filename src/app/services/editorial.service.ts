import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Editorial } from '../models/editoral';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  URL_API = 'http://localhost:4000/editorials';

  // objeto de tipo editorial
  editorialSelected: Editorial = {
    id_editorial: 0,
    name: ''
  };

  editorialArray: Editorial[]; // array de tipo editorial

  constructor(private http: HttpClient) { }

  existEditorialByName(name: string){
    // devuelve true/false
    return this.http.get('http://localhost:4000/editorials/exist/' + name);
  }

  createEditorial(editorial: Editorial){
    return this.http.post('http://localhost:4000/createEditorial', editorial);
  }

  updateEditorial(editorial: Editorial){
    return this.http.put('http://localhost:4000/editorials/update/id', editorial);
  }

  getEditorials(){
    return this.http.get<Editorial[]>(this.URL_API);
  }

  getEditorialById(id: string): Observable<Editorial> {
    return this.http.get<Editorial>(`${this.URL_API}/${id}`);
  }

  getEditorialByName(name: string) {
    return this.http.get<Editorial[]>('http://localhost:4000/editorials/name/' + name);
  }

}
