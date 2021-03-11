import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  URL_API = 'http://localhost:4000/categories';

  // objeto Category
  categorySelected: Category = {
    id_category: 0,
    name: ''
  };

  categoryArray: Category[]; // array de tipo Category

  constructor(private http: HttpClient) { }

  getCategories(){
    return this.http.get<Category[]>(this.URL_API);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.URL_API}/${id}`);
  }

  createCategory(category: Category){
    return this.http.post('http://localhost:4000/createCategory', category);
  }

  updateCategory(category: Category){
    return this.http.put('http://localhost:4000/categories/update/id', category);
  }

  getCategoryByName(name: string) {
    return this.http.get<Category[]>('http://localhost:4000/categories/name/' + name);
  }

  existCategoryName(name: string){
    // return true o false
    return this.http.get('http://localhost:4000/categories/exist/' + name);
  }

  // cleanUnnecessaryWhiteSpaces(control: AbstractControl) {
  //   // return cadena.replace(/\s{2,}/g, ' ').trim();
  //   const text = control.value;
  //   return text.replace(/\s{2,}/g, ' ').trim();
  // }

}
