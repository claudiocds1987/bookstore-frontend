import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  SERVER = 'http://localhost:3000';
  // objeto vacio tipo Book
  book: Book = {
    name: '',
    year: 0,
    id_author: 0,
    id_category: 0,
    id_editorial: 0,
    description: '',
    quantity: 0,
    price: 0,
    url_image: '',
    state: true,
    id_book: 0,
  };

  bookArray: Book[]; // array de tipo Book

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  getBookById(id: string) {
    return this.http.get<Book[]>(`${this.SERVER}/books/${id}`);
  }

  getImage() {
    return this.http.get<any>(
      'https://bookstore-cds-server.herokuapp.com/1f2d312a-a1ef-48c5-a79f-c2a27c48320c.jpg'
    );
  }

  // trae todos los libros sin importar su estado state
  getBooksWithAuthorName() {
    return this.http.get<Book[]>(`${this.SERVER}/booksAuthorName`);
  }

  // trae solo los libros que tiene state = true (aptos parta la venta)
  getAvailableBooksWithAuthorName() {
    return this.http.get<Book[]>(
      `${this.SERVER}/AvailableBooksWithAuthorName`
    );
  }

  getOneBookWithAuthorName(id: string) {
    return this.http.get<Book[]>(
      `${this.SERVER}/bookAuthorName/${id}`
    );
  }

  getRealDataBook(id: string) {
    // trae toda la data de book
    // mas nombre de autor, nombre de editorial y nombre de categoria que no estan en el model Book
    // por eso de tipo "any"
    return this.http.get<any[]>(
      // `${'http://localhost:4000/getRealDataBook'}/${id}`
      `${this.SERVER}/getRealDataBook/${id}`
    );
  }

  getBooks() {
    return this.http.get<Book[]>(`${this.SERVER}/books`);
  }

  // get cantidad de libros totales(con state=true y state=false)
  getTotalBooks() {
    return this.http.get<any[]>(`${this.SERVER}/books/get/total`);
  }

  existBook(bookName: string, idAuthor: number) {
    return this.http.get(
      `${this.SERVER}/books/exist/` + bookName + '/' + idAuthor
    );
  }

  createBook(book: Book) {
    return this.http.post(`${this.SERVER}/books`, book);
  }

  updateBook(book: Book) {
    // return this.http.put(`${this.URL_API}/${book.id_book}`, book);
    return this.http.put(`${this.SERVER}/books/${book.id_book}`, book);
  }

  filterAvailableBooksByName(name: string) {
    return this.http.get<Book[]>(
      // 'http://localhost:4000/filterAvailableBooksByName/' + name
      `${this.SERVER}/filterAvailableBooksByName/` + name
    );
  }

  filterBooksByName(name: string) {
    return this.http.get<Book[]>(
     // 'http://localhost:4000/filterBooksByName/' + name
     `${this.SERVER}/filterBooksByName/` + name
    );
  }

  filterAvailableBooksByAuthor(name: string) {
    return this.http.get<Book[]>(
      // 'http://localhost:4000/filterAvailableBooksByAuthor/' + name
      `${this.SERVER}/filterAvailableBooksByAuthor/` + name
    );
  }

  ///////////////////////////////////////////////////////////////
  filterAvailableBooks(data: any) {
    return this.http.post<Book[]>(
      `${this.SERVER}/books/filterAvailableBooks`, data
    );
  }
  //////////////////////////////////////////////////////////////

  filterBooksByAuthor(name: string) {
    return this.http.get<Book[]>(
      // 'http://localhost:4000/filterBooksByAuthor/' + name
      `${this.SERVER}/filterBooksByAuthor/` + name
    );
  }

  bajaBook(idBook: number, changes: Partial<Book>) {
   // const url = 'http://localhost:4000/books/baja/';
   const url = `${this.SERVER}/books/baja/`;
    return this.http.put(`${url}${idBook}`, changes);
  }

  altaBook(idBook: number, changes: Partial<Book>) {
    // const url = 'http://localhost:4000/books/alta/';
    const url = `${this.SERVER}/books/alta/`;
    return this.http.put(`${url}${idBook}`, changes);
  }

}
