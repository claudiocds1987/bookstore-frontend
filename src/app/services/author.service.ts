import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../models/author';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  // URL_API = 'http://localhost:4000/authors';
  SERVER = 'http://localhost:3000';

  // objeto Author
  authorSelected: Author = {
    id_author: 0,
    name: ''
  };

  authorArray: Author[]; // array de tipo Autor

  constructor(private http: HttpClient) { 
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  existAuthorByName(name: string){
    // return this.http.get('http://localhost:4000/authors/exist/' + name);
    return this.http.get(`${this.SERVER}/authors/exist/` + name);
  }

  createAuthor(author: Author){
    // return this.http.post('http://localhost:4000/authors/create', author);
    return this.http.post(`${this.SERVER}/authors/create`, author);
  }

  updateAuthor(author: Author){
    // return this.http.put('http://localhost:4000/authors/update/id', author);
    return this.http.put(`${this.SERVER}/authors/update/id`, author);
  }

  getAuthors() {
    // return this.http.get<Author[]>(this.URL_API);
    return this.http.get<Author[]>(`${this.SERVER}/authors`);
  }

  getAuthorById(id: string): Observable<Author> {
    // return this.http.get<Author>(`${this.URL_API}/${id}`);
    return this.http.get<Author>(`${this.SERVER}/authors/${id}`);
  }

  getAuthorByName(name: string) {
    // return this.http.get<Author[]>('http://localhost:4000/authors/name/' + name);
    return this.http.get<Author[]>(`${this.SERVER}/authors/name/` + name);
  }

  filterAuthorsByName(name: string) {
    // return this.http.get<Author[]>('http://localhost:4000/authors/filter/' + name);
    return this.http.get<Author[]>(`${this.SERVER}/authors/filter/` + name);
  }

}
