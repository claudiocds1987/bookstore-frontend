import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { CartService } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';
import { OrderDetailService } from '../../../../services/order-detail.service';
import { SaleService } from '../../../../services/sale.service';
import { SaleDetailService } from '../../../../services/sale-detail.service';
import { UserService } from '../../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';
import { MercadopagoService } from '../../../../services/mercadopago.service';
// models
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/orderDetail';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/saleDetail';
import { User } from 'src/app/models/user';
import { Book } from 'src/app/models/book';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Compramp } from 'src/app/models/compramp';
// componente a mostrar cuando se utilice Material Dialog para eliminar un producto
import { MatConfirmDialogComponent } from '../../../../mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'app-form-purchase',
  templateUrl: './form-purchase.component.html',
  styleUrls: ['./form-purchase.component.scss']
})
export class FormPurchaseComponent implements OnInit {

  form: FormGroup;
  // variables para el api de pagos Stripe
  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardError: string;
  card: any;
  // ------------------------------------------------
  idBooks: Book[] = [];
  /* bookList: any[]; de tipo any porque en localStorage('shopingCart') trae un elemento "autor" que no existe en type Book
     si la declaro como bookList: book[]; en html cuando muestre book.autor va a marcar error.*/
  bookList: any[];
  total: number;
  provincia = 'Buenos Aires';
  // array de tipo user
  // userArray: User[] = [];
  // objetos
  order = {} as Order;
  orderDetail = {} as OrderDetail;
  sale = {} as Sale;
  saleDetail = {} as SaleDetail;
  // fecha local
  currentDate = new Date();
  orderSuccess = false;
  dialogRef: MatDialogRef<MatConfirmDialogComponent>;
  maxQuantity: number[] = [];
  habilitarBtnPagar = false;
  username;
  // idUser: number;

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public orderService: OrderService,
    public orderDetailService: OrderDetailService,
    public saleServices: SaleService,
    public saleDetailServices: SaleDetailService,
    public alertService: AlertService,
    public userService: UserService,
    public mercadopagoService: MercadopagoService,
    private ngZone: NgZone,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.buildForm();
    // Obteniendo la data de la localStorage 'shoppingCart' creada en cart.services.ts
    if (localStorage.getItem('shoppingCart') != null) {
      // aca la url_image viene limpia, no hay que pasarla por funcion linkImg()
      this.bookList = JSON.parse(localStorage.getItem('shoppingCart'));

      // seteo quantity = 1 de cada libro
      for (const item of this.bookList) {
        this.maxQuantity.push(item.quantity); // quantity de la db para max limit en input
        item.quantity = 1; // seteo quantity = 1 de cada libro
      }

       // aca localstorage para success-purchasess, cuando mercadopago informe compra exitosa
       // esta localStorage se llama en successful-purchase.component.ts
      localStorage.setItem('purchase', JSON.stringify(this.bookList));
      // localStorage.setItem('orderData', JSON.stringify(this.order));

      // calculo total de precio
      this.total = this.bookList
        .map((item) => Number(item.price))
        .reduce((count, item) => count + item, 0);
    }
    // Obteniendo la data de la localStorage 'idBooks' creada en home.ts
    if (localStorage.getItem('books') != null) {
      const data = JSON.parse(localStorage.getItem('books'));
      for (const value of data) {
        this.idBooks = [...this.idBooks, value];
      }
    }
  }

  ngOnInit(): void {
    // si no hay username, no esta logeado, no puede comprar.
    if (localStorage.getItem('username') != null) {
      this.username = localStorage.getItem('username');
      // obtengo el id del usuario para el objeto order
      this.getUserId(this.username);
    }
  }


  orderData(){
    if (this.form.valid){
      // el objeto order esta vinculado con un [(ngModel)] en los input
      // El order.id_user se obtuvo en funcion getUserId()
      this.order.order_date = this.currentDate;
      this.order.total_price = this.total;
      console.log('FECHA: ' + this.order.order_date);
      console.log('ID USER: ' + this.order.id_user);
      console.log('PROVINCIA: ' + this.order.provincia);
      console.log('LCOALIDAD: ' + this.order.localidad);
      console.log('DOMICILIO: ' + this.order.adress);
      console.log('TELEFONO: ' + this.order.phone_number);
      console.log('PRECIO TOTAL: ' + this.order.total_price);
      // creo/piso la localStorage orderData para successful-purchase.component.ts
      localStorage.setItem('orderData', JSON.stringify(this.order));
    }
  }

  getUserId(username: string) {
    this.userService.getUserByUserName(username).subscribe(
      (res) => {
        // le paso el objeto order el id_user
        this.order.id_user = res[0].id_user;
      },
      (err) => console.error('Error al obtener el username en ngOnInit ' + err)
    );
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      provincia: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z ]+$/),
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
      localidad: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z ]+$/),
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
      adress: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.maxLength(12),
          Validators.minLength(8),
        ],
      ],
    });
  }

  // para utilizar en los *ngIf mostrando si hay error en los input
  get provinciaField() {
    return this.form.get('provincia');
  }

  get localidadField() {
    return this.form.get('localidad');
  }

  get adressField() {
    return this.form.get('adress');
  }

  get phoneNumberField() {
    return this.form.get('phoneNumber');
  }
  // --------------------------------------------------------------

  // esta función actualiza en bookList la prop "book.quantity" con la cant. elegida en el input number
  public updateItem(event: Event, itemId: string | number, row): void {
    for (const book of this.bookList) {
      if (book.id_book === itemId) {
        // obtengo la cantidad elegida del input number
        let currentQuantity = parseFloat(
          (event.target as HTMLInputElement).value
        );
        // si la cantidad elegida es mayor a la cant que figura en la db
        if (currentQuantity > this.maxQuantity[row]) {
          currentQuantity = this.maxQuantity[row]; // seteo el input al quantity que figura en la db
          this.alertService.showError(
            'No quedan mas unidades disponibles de este producto',
            'Limite disponible: ' + this.maxQuantity[row]
          );
        }
        if (currentQuantity < 1) {
          // Validamos el mínimo de 1 unidad
          currentQuantity = 1;
        }
        (event.target as HTMLInputElement).value = currentQuantity.toString(); // Forzamos el valor según las validaciones
        // actualizo la cantidad en bookList
        book.quantity = currentQuantity;
        break;
      }
    }
     // aca localstorage para success-purchasess
    localStorage.setItem('purchase', JSON.stringify(this.bookList));
    this.calculateTotalPrice();
  }

  // esta funcion actualiza el precio cuando cambia la cantidad del input number
  public calculateTotalPrice(): void {
    let newTotal = 0;
    for (const book of this.bookList) {
      newTotal += book.quantity * book.price;
    }
    this.total = newTotal;
  }

  // Aca va leyendo los datos de la tarjeta mientras se tipean
  onChange({ error }) {
    if (error) {
      this.ngZone.run(() => (this.cardError = error.message));
      // si hay errores "inhabilito" el boton Pahar
      this.habilitarBtnPagar = false;
    } else {
      this.ngZone.run(() => (this.cardError = null));
      // si no hay errores "habilito" el boton Pagar
      this.habilitarBtnPagar = true;
    }
  }

  onDelete(idProduct: number) {
    // this.dialog.open(le paso por parametro el componente mat-confirm-dialog.component.html);
    // es el componente que se va a mostrar en la ventana(modal) antes de eliminar el producto
    this.dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      disableClose: false,
    });
    // enviando el mensaje a mostrar en la ventana (modal)
    this.dialogRef.componentInstance.confirmMessage =
      '¿Realmente desea eliminar el producto?';
    // me subscribo a lo que recibio el modal ("true" si confirmo, "false" si cancelo)
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // si hizo click en ok es true, elimina producto
        this.deleteItem(idProduct);
      } // si cancelo
      this.dialogRef = null;
    });
  }

  deleteItem(id: number) {
    // borro el producto del array que contiene la data de la localStorage 'shoppingCart'
    for (let i = 0; i < this.bookList.length; i++) {
      if (id === this.bookList[i].id_book) {
        this.bookList.splice(i, 1);
      }
    }
    // actualizo el precio total
    this.calculateTotalPrice();
    // elimino el id del producto en el array que contiene la data de la localStorage 'idBooks'
    for (let z = 0; z < this.idBooks.length; z++) {
      if (id === this.idBooks[z].id_book) {
        this.idBooks.splice(z, 1);
      }
    }
    // actualizo la localStorage 'books' creada en home.ts
    localStorage.setItem('books', JSON.stringify(this.idBooks));
    // si se eliminaron todos los productos en order.html borro las localStorage
    if (this.bookList.length <= 0) {
      localStorage.removeItem('shoppingCart');
      localStorage.removeItem('books');
      this.cartService.cart.next(this.bookList);
      // redirije a view home
      this.router.navigate(['home']);
    } else {
      // guardo el array actualizado en la localStorage
      localStorage.setItem('shoppingCart', JSON.stringify(this.bookList));
      // de esta forma en el main-nav se descuenta el numero de items que hay en el carrito
      this.cartService.cart.next(this.bookList);
    }
  }

}
