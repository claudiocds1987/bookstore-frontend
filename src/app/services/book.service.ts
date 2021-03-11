import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  URL_API = 'http://localhost:4000/books';
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
    id_book: 0
  };

  bookArray: Book[]; // array de tipo Book

  constructor(private http: HttpClient) { }

  getBookById(id: string){
    return this.http.get<Book[]>(`${this.URL_API}/${id}`);
  }

  getImage(){
    return this.http.get<any>('http://localhost:4000/1f2d312a-a1ef-48c5-a79f-c2a27c48320c.jpg');
  }

  // trate todos los sin importar su estado state
  getBooksWithAuthorName() {
    // http://localhost:4000/booksAuthorName
    return this.http.get<Book[]>(this.URL_API + 'AuthorName');
  }

  // trae solo los libros que tiene state = true (aptos parta la venta)
  getAvailableBooksWithAuthorName() {
    return this.http.get<Book[]>('http://localhost:4000/AvailableBooksWithAuthorName');
  }

  getOneBookWithAuthorName(id: string) {
    return this.http.get<Book[]>(`${'http://localhost:4000/bookAuthorName'}/${id}`);
  }

  getRealDataBook(id: string) {
    // trae toda la data de book
    // mas nombre de autor, nombre de editorial y nombre de categoria que no estan en el model Book
    // por eso de tipo "any"
    return this.http.get<any[]>(`${'http://localhost:4000/getRealDataBook'}/${id}`);
  }

  getBooks() {
    return this.http.get<Book[]>(this.URL_API);
  }

  existBook(bookName: string, idAuthor: number){
    return this.http.get('http://localhost:4000/books/exist/' + bookName + '/' + idAuthor);
  }

  createBook(book: Book){
    // console.log(book);
    return this.http.post(this.URL_API, book);
  }

  updateBook(book: Book){
    // console.log('Ca update book: ' + book.name);
    return this.http.put(`${this.URL_API}/${book.id_book}`, book);
  }

  filterAvailableBooksByName(name: string){
    return this.http.get<Book[]>('http://localhost:4000/filterAvailableBooksByName/' + name);
  }

  filterBooksByName(name: string){
    return this.http.get<Book[]>('http://localhost:4000/filterBooksByName/' + name);
  }

  filterAvailableBooksByAuthor(name: string){
    return this.http.get<Book[]>('http://localhost:4000/filterAvailableBooksByAuthor/' + name);
  }

  filterBooksByAuthor(name: string){
    return this.http.get<Book[]>('http://localhost:4000/filterBooksByAuthor/' + name);
  }

  bajaBook(idBook: number, changes: Partial<Book>){
   const url = 'http://localhost:4000/books/baja/';
   return this.http.put(`${url}${idBook}`, changes);
  }

  altaBook(idBook: number, changes: Partial<Book>){
    const url = 'http://localhost:4000/books/alta/';
    return this.http.put(`${url}${idBook}`, changes);
   }


}
