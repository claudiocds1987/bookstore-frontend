import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Book } from '../../models/book';
import { Router } from '@angular/router';
import { style } from '@angular/animations';
import { transform } from 'typescript';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches),
  //     shareReplay()
  //   );

  total$: Observable<number>;
  total = 0;
  bookArray: Book[] = [];
  username: string;

  constructor(
    //private breakpointObserver: BreakpointObserver,
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

  checkItems() {
    if (localStorage.getItem('shoppingCart') === null) {
      this.alertService.showError('El carrito esta vacio', '');
    } else {
      // "href" para que haga "refresh" cada vez que entra en "view order.html" sino "stripe" muestra el pago
      // tarjeta una vez sola(al entrar por 1ra vez a order), si salgo de order y vuelvo a entrar desaparece,
      // "stripe" necesita hacer un refresh para no tener problema.
      // window.location.href = '/order/create-order';
      
      window.location.href = '/purchase/form-purchase';
    }
  }
}
