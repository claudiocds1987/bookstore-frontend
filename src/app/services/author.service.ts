import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../models/author';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  URL_API = 'http://localhost:4000/authors';

  // objeto Author
  authorSelected: Author = {
    id_author: 0,
    name: ''
  };

  authorArray: Author[]; // array de tipo Autor

  constructor(private http: HttpClient) { }

  existAuthorByName(name: string){
    return this.http.get('http://localhost:4000/authors/exist/' + name);
  }

  createAuthor(author: Author){
    return this.http.post('http://localhost:4000/authors/create', author);
  }

  updateAuthor(author: Author){
    return this.http.put('http://localhost:4000/authors/update/id', author);
  }

  getAuthors() {
    return this.http.get<Author[]>(this.URL_API);
  }

  getAuthorById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.URL_API}/${id}`);
  }

  getAuthorByName(name: string) {
    return this.http.get<Author[]>('http://localhost:4000/authors/name/' + name);
  }

  filterAuthorsByName(name: string) {
    return this.http.get<Author[]>('http://localhost:4000/authors/filter/' + name);
  }

}
