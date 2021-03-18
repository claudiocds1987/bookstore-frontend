import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // URL_API = 'http://localhost:4000/categories';
  SERVER = 'http://localhost:3000';

  // objeto Category
  categorySelected: Category = {
    id_category: 0,
    name: '',
  };

  categoryArray: Category[]; // array de tipo Category

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  getCategories() {
    // return this.http.get<Category[]>(this.URL_API);
    return this.http.get<Category[]>(`${this.SERVER}/categories`);
  }

  getCategoryById(id: string): Observable<Category> {
    // return this.http.get<Category>(`${this.URL_API}/${id}`);
    return this.http.get<Category>(`${this.SERVER}/categories/${id}`);
  }

  createCategory(category: Category) {
    // return this.http.post('http://localhost:4000/createCategory', category);
    return this.http.post(`${this.SERVER}/createCategory`, category);
  }

  updateCategory(category: Category) {
    // return this.http.put('http://localhost:4000/categories/update/id', category);
    return this.http.put(`${this.SERVER}/categories/update/id`, category);
  }

  getCategoryByName(name: string) {
    // return this.http.get<Category[]>('http://localhost:4000/categories/name/' + name);
    return this.http.get<Category[]>(`${this.SERVER}/categories/name/` + name);
  }

  existCategoryName(name: string) {
    // return true o false
    // return this.http.get('http://localhost:4000/categories/exist/' + name);
    return this.http.get(`${this.SERVER}/categories/exist/` + name);
  }

  // cleanUnnecessaryWhiteSpaces(control: AbstractControl) {
  //   // return cadena.replace(/\s{2,}/g, ' ').trim();
  //   const text = control.value;
  //   return text.replace(/\s{2,}/g, ' ').trim();
  // }
}
