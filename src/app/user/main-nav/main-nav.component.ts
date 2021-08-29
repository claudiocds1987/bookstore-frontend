import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Book } from '../../models/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  // para ocultar/mostrar el menu leer mi documentacion
  hide: boolean = false;
  show: boolean = false;
  // ----------------------------------------------------
  total$: Observable<number>;
  total = 0;
  bookArray: Book[] = [];
  username: string;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    public alertService: AlertService,
    public router: Router
  ) {
    // mientras no se refresque la pagina el total de items los muestro asi
    this.cartService.cart$.subscribe((libros) => {
      this.total = libros.length;
    });

    // mientras no se refresque la pagina el username lo muestro asi
    this.authService.username$.subscribe((username) => {
      this.username = username;
    });
  }

  ngOnInit(): void {
    // si se refresque la pagina, cargo los datos del localStorage para determinar el total de items del carrito
    // esta localStorage fue creada en cart.service.ts
    if (localStorage.getItem('shoppingCart') != null) {
      this.bookArray = JSON.parse(localStorage.getItem('shoppingCart'));
      this.total = this.bookArray.length;
      // console.log('el total en el ngOnit es: ' + this.bookArray.length);
    }
    // si se refresque la pagina, cargo los datos del localStorage para mostrar el username
    // esta localStorage fue creada en auth.service.ts
    if (localStorage.getItem('username') != null) {
      this.username = localStorage.getItem('username');
    }
  }

  hideMenu(name: string) {
    switch (name) {
      // cuando es click en el toogle
      case 'menu-bar':
        if (this.show === false) {
          // se muestra el menu
          this.hide = false;
          this.show = true;
        } else {
          // se oculta el menu
          this.hide = true;
          this.show = false;
        }
        break;
      // cuando hay click en item del menu
      case 'home':
        this.hide = true;
        this.show = false;
        this.router.navigate(['/home']);
        break;
      case 'contact':
        this.hide = true;
        this.show = false;
        this.router.navigate(['/contact/contact']);
        break;
      case 'login':
        this.hide = true;
        this.show = false;
        this.router.navigate(['/auth/login']);
        break;
      case 'carrito':
        this.hide = true;
        this.show = false;
        this.router.navigate(['/purchase/form-purchase']);
        break;
      default:
      // code block
    }
  }

  checkItems() {
    if (localStorage.getItem('shoppingCart') === null) {
      this.alertService.showError('El carrito esta vacio', '');
    } else {
      // explicar por que aca la funcion hideMenu
      this.hideMenu('carrito');
    }
  }
}
