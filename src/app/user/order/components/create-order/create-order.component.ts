import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { CartService } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';
import { OrderDetailService } from '../../../../services/order-detail.service';
import { StripeService } from '../../../../services/stripe.service';
import { SaleService } from '../../../../services/sale.service';
import { SaleDetailService } from '../../../../services/sale-detail.service';
import { UserService } from '../../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';
// models
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/orderDetail';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/saleDetail';
import { User } from 'src/app/models/user';
import { Book } from 'src/app/models/book';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
// componente a mostrar cuando se utilice Material Dialog para eliminar un producto
import { MatConfirmDialogComponent } from '../../../../mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit, AfterViewInit {
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
  userArray: User[] = [];
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

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public orderService: OrderService,
    public orderDetailService: OrderDetailService,
    public saleServices: SaleService,
    public saleDetailServices: SaleDetailService,
    public alertService: AlertService,
    public userService: UserService,
    private ngZone: NgZone,
    private stripeService: StripeService,
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

  // funcion que checkea si todos los inputs estan bien ?
  // public findInvalidControls() {
  //   const invalid = [];
  //   const controls = this.AddCustomerForm.controls;
  //   for (const name in controls) {
  //       if (controls[name].invalid) {
  //           invalid.push(name);
  //       }
  //   }
  //   return invalid;
  // }

  ngOnInit(): void {
    if (localStorage.getItem('username') != null) {
      const username = localStorage.getItem('username');
      this.getUserByUserName(username);
    }
  }

  ngAfterViewInit() {
    // la variable "elements" esta definida en el archivo typings.d.ts
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.onChange.bind(this));
  }

  getUserByUserName(username: string) {
    this.userService.getUserByUserName(username).subscribe(
      (res) => {
        this.userArray = res;
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
    this.calculateTotalPrice();
  }

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

  createOrder() {
    // id_order no importa porque en la db es autonumerico
    this.order.id_user = this.userArray[0].id_user;
    this.order.order_date = this.currentDate;
    this.order.total_price = this.total;
    this.orderService.createOrder(this.order).subscribe(
      (res) => {
        console.log('La orden fue creada exitosamente');
        this.createOrderDetail();
      },
      (err) => console.error('No se pudo crear la orden ' + err.error.message)
    );
  }

  createOrderDetail() {
    // antes de crear el detalle de la orden traigo el ultimo id_order de la tabla "orders" de la base de datos
    let idOrder;
    this.orderService.getLastIdOrder().subscribe(
      (res) => {
        idOrder = res;
        // .lastIdOrder porque en la query esta como as "lastIdOrder"
        console.log('Ultimo idOrder obtenido: ' + idOrder.lastIdOrder);
        for (const item of this.bookList) {
          this.orderDetail.id_order = idOrder.lastIdOrder;
          this.orderDetail.id_product = item.id_book;
          this.orderDetail.product_price = item.price;
          // item.quantity viene seteada = 1 desde home.ts , toma otro valor si se cambia la cant. 
          // desde el input number gracias a la funcion updateItem()
          this.orderDetail.product_quantity = item.quantity;
          // se crea el detalle de la orden de compra
          this.orderDetailService.createOrderDetail(this.orderDetail).subscribe(
            (resp) => {
              console.log(
                'El detalle de la orden fue creada exitosamente ' + resp
              );
            },
            (err) =>
              console.error(
                'No se pudo crear el detalle de la orden ' + err.error.message
              )
          );
        }
      },
      (err) =>
        console.error(
          'Error al intentar obtener el ultimo idOrder de la base de datos'
        )
    );
  }

  createSale() {
    this.sale.id_user = this.userArray[0].id_user;
    this.sale.total_price = this.total;
    this.sale.date = this.currentDate;
    this.saleServices.createSale(this.sale).subscribe(
      (res) => {
        console.log('La venta fue creada');
        this.createSaleDetail();
      },
      (err) => console.error('No se pudo crear la venta ' + err.error.message)
    );
  }

  createSaleDetail() {
    let idSale;
    // antes de crear el detalle de venta, necesito obtener el id de la venta creada
    this.saleServices.getLastIdSale().subscribe(
      (res) => {
        idSale = res;
        // .lastIdSale porque en la query esta como as "lastIdSale"
        console.log('Ultimo idSale obtenido: ' + idSale.lastIdSale);
        // se crea el detalle de la venta
        for (const item of this.bookList) {
          this.saleDetail.id_book = item.id_book;
          this.saleDetail.id_sale = idSale.lastIdSale;
          this.saleDetail.price = item.price;
          // item.quantity viene seteada = 1 desde home.ts , toma otro valor si se cambia la cant.
          // desde el input number gracias a la funcion updateItem()
          this.saleDetail.quantity = item.quantity;
          // ¿ seria mejor un array de tipo saleDetail que guarde el obj en cada iteracion
          // despues afuera uso un for y hago el createSaleDetail ??
          this.saleDetailServices.createSaleDetail(this.saleDetail).subscribe(
            (resp) => {
              console.log('El detalle de venta fue creado ' + resp);
            },
            (err) =>
              console.error(
                'No se pudo crear el detalle de venta ' + err.error.message
              )
          );
        }
      },
      (err) =>
        console.error(
          'No se pudo obtener el último id de venta ' + err.error.message
        )
    );
  }

  // "async" porque devuelve una promesa
  async pagar(event: Event) {
    if (localStorage.getItem('username') === null) {
      this.alertService.showError(
        'Para poder comprar debe tener una cuenta de usuario.',
        ''
      );
    } else {
      event.preventDefault();
      if (this.form.valid) {
        // se habilita boton pagar
        const btnPagar = document.getElementById('btn-pagar');
        btnPagar.setAttribute('disabled', 'true');
        //  EFECTUANDO EL PAGO
        const { token, error } = await stripe.createToken(this.card);
        if (token) {
          // console.log(token);
          // el total a pagar esta seteado en 1 pr prueba, si quiero el valor real a pagar por parametro le paso la variable this.total
          // es decir const response = await this.stripeService.charge(this.total, token.id);
          await this.stripeService.charge(1, token.id).then(
            (res) => {
              console.log('el pago fue realizado');
              // se crea la orden y el detalle de la orden que esta adentro de la funcion createOrder
              this.createOrder();
              // se crea la venta y el detalle de venta que esta adentro de la funcion createSale()
              this.createSale();
              // borro las local storage
              localStorage.removeItem('books');
              localStorage.removeItem('shoppingCart');
              // seteo el carrito a 0 items en el boton del carrito del componente main-nav
              this.cartService.cart.next([]);
              // this.dialog.open(le paso por parametro el componente mat-confirm-dialog.component.html);
              // es el componente que se va a mostrar en la ventana(modal) antes de eliminar el producto
              this.dialogRef = this.dialog.open(MatConfirmDialogComponent, {
                disableClose: false,
              });
              // enviando el mensaje a mostrar en la ventana (modal)
              this.dialogRef.componentInstance.confirmMessage =
                'Su compra fue realizada. ¿Desea ver sus compras?';
              // me subscribo a lo que recibio el modal ("true" si confirmo, "false" si cancelo)
              this.dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                  // aca solucionar problema, no redirije a orders-list
                  this.router.navigate(['order/orders-list']);
                }
                this.dialogRef = null;
                /// si cancela va a home
                this.router.navigate(['home']);
              });
            },
            (err) => console.error('Falla al intentar pagar')
          );
        } else {
          this.ngZone.run(() => (this.cardError = error.message));
          this.alertService.showError(
            'Los datos de la tarjeta no son correctos',
            'ERROR DE PAGO'
          );
        }
      }
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

    // actualizo el precio total funciona mal
    // this.total = this.bookList
    //   .map((item) => Number(item.price))
    //   .reduce((count, item) => count + item, 0);

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
