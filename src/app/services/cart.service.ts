// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private bookArray: Book[] = [];
  // cart es como un canal (BehaviorSubject)
  public cart = new BehaviorSubject<Book[]>([]);
  // cart$ (Es el "Observable" de BehaviorSubject cart), escucha o se entera de las actualizaciones que va teniendo "BehaviorSubject cart"
  // entonces a medida que el carrito se va llenando en el "BehaviorSubject cart", con el "Observable cart$"" se puede
  // saber desde cualquier componente cual es el estado actual del carrito (cuantos items tiene).
  public cart$ = this.cart.asObservable();

  constructor() {}

  addCart(book: Book) {
    // fijate en configuraciones de google chrome que este habilitada la opcion de mostrar cookies
    // caso contrario las local storage pueden que no funcionen
    if (localStorage.getItem('shoppingCart') != null) {
      // obtengo en el array los datos del local Storage
      this.bookArray = JSON.parse(localStorage.getItem('shoppingCart'));
      // agrego el nuevo producto al array
      this.bookArray = [...this.bookArray, book];
      // guardo el array actualizado en local storage
      localStorage.setItem('shoppingCart', JSON.stringify(this.bookArray));
      // la variable this.cart es llamada desde main-nav tmb para mostrar la cantidad de productos que hay en el carrito
      this.cart.next(this.bookArray);
    } else {
      // importante poner este array vacio, porque si del carrito elimino todos los items cuando vuelvo a agregar productos
      // y entra por aca, me queda el array cargado.
      this.bookArray = [];
      // primer carga de book
      this.bookArray = [...this.bookArray, book];
      // el metodo .next es propio de la clase BehaviorSubject, su funcion es enviar un valor
      // (en este caso el array) a la variable cart de tipo BehaviorSubject
      this.cart.next(this.bookArray);
      localStorage.setItem('shoppingCart', JSON.stringify(this.bookArray));
    }
  }
}
