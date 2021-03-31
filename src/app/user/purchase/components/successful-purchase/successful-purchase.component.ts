import { Component, OnInit } from '@angular/core';
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

// componente a mostrar cuando se utilice Material Dialog para eliminar un producto
import { MatConfirmDialogComponent } from '../../../../mat-confirm-dialog/mat-confirm-dialog.component';
import { ThemeService } from 'ng2-charts';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-successful-purchase',
  templateUrl: './successful-purchase.component.html',
  styleUrls: ['./successful-purchase.component.scss'],
})
export class SuccessfulPurchaseComponent implements OnInit {
  /* bookList: any[]; de tipo any porque en localStorage('shopingCart') trae un elemento "autor" que no existe en type Book
     si la declaro como bookList: book[]; en html cuando muestre book.autor va a marcar error.*/
  bookList: any[];
   // array de tipo user
  // userArray: User[] = [];
  // objetos
  order = {} as Order;
  orderDetail = {} as OrderDetail;
  sale = {} as Sale;
  saleDetail = {} as SaleDetail;
  // fecha local
  // currentDate = new Date();
  // total: number;
  // idUser: number;

  constructor(
    public cartService: CartService,
    public orderService: OrderService,
    public orderDetailService: OrderDetailService,
    public saleServices: SaleService,
    public saleDetailServices: SaleDetailService,
    public alertService: AlertService,
    public userService: UserService,
    public mercadopagoService: MercadopagoService,
    private dialog: MatDialog
  ) {

    // la localstorage purchase se crea en form-pruchase.component.ts
    if (localStorage.getItem('purchase') != null && localStorage.getItem('orderData') != null) {
      // aca la url_image viene limpia, no hay que pasarla por funcion linkImg()
      this.bookList = JSON.parse(localStorage.getItem('purchase'));
      // obtengo los datos de la orden de la localStorage 'orderData' creada en form-purchase.component.ts
      this.order = JSON.parse(localStorage.getItem('orderData'));
      // obtengo el precio total
      // this.calculateTotalPrice();

      // YA TENGO TODO EN LOCALSTORAGE 'ORDERDATA'

      // creo la orden de compra, dentro de createOrder() se crea el detalle de la compra
      this.createOrder();
       // creo la venta, dentro de createSaler() se crea el detalle de la venta
      this.createSale(); // creo la venta

      // if (localStorage.getItem('orderData') != null){
      //   this.order = JSON.parse(localStorage.getItem('orderData'));
      //   console.log('FECHA: ' + this.order.order_date);
      //   console.log('ID USER: ' + this.order.id_user);
      //   console.log('PROVINCIA: ' + this.order.provincia);
      //   console.log('LCOALIDAD: ' + this.order.localidad);
      //   console.log('DOMICILIO: ' + this.order.adress);
      //   console.log('TELEFONO: ' + this.order.phone_number);
      //   console.log('PRECIO TOTAL: ' + this.order.total_price);
      // }

      // if (localStorage.getItem('username') != null) {
      //   // obtengo el username
      //   const username = localStorage.getItem('username');
      //   // obtengo los datos del usuario
      //   this.getUserByUserName(username);
      // }
      // else{
      //   console.log('la LocalStorage username no existe, no se puede obtener al usuario');
      // }

      // borrando las localstorage (menos la del username)
      localStorage.removeItem('books');
      localStorage.removeItem('shoppingCart');
      localStorage.removeItem('purchase');
      localStorage.removeItem('orderData');
      // seteo el carrito a 0 items en el boton del carrito del componente main-nav
      this.cartService.cart.next([]);
    }else{
      console.log('NO SE CREO LOCALSTORAGE PURCHASE O ORDERDATE');
    }
  }

  ngOnInit(): void {}


  // public calculateTotalPrice(): void {
  //   let newTotal = 0;
  //   for (const book of this.bookList) {
  //     newTotal += book.quantity * book.price;
  //   }
  //   this.total = newTotal;
  // }

  // getUserByUserName(username: string) {
  //   // Aca createOrder y createSale() porque para crear la orden y la venta necesito el id del usuario
  //   // en node las funciones son asyncronas, esto significa que si tengo mas de 1 peticion a node
  //   // desde por ej Angular, las respuestas de esas peticiones no van a llegar de forma ordenada.
  //   // Ej: si en Angular tengo un 'servicio' A que le pide a node el id de un usuario y al mismo tiempo
  //   // otro 'servicio B' que necesita de ese id para determinar la cantidad de compras que hizo este mismo usuario
  //   // va a dar un error, porque ni bien se ejecuta el 'servicio A', se ejecuta el 'B' y 'B' todava no tiene la
  //   // respuesta de 'A'. Para solucionar esto hago un encadenamiento de subscribe (no es lo conveniente), con esto
  //   // entonces me subscribo al 'servicio A', si tengo respuesta invoco al 'servicio B'.
  //   this.userService.getUserByUserName(username).subscribe(
  //     (res) => {
  //       //this.userArray = res;
  //       this.idUser = res[0].id_user;
  //       console.log('ACA EL ID: ' + this.idUser);
  //       // se crea la orden de compra, dentro de createOrder() se crea el detalle de la orden de compra.
  //       this.createOrder();
  //       // se crea la venta, dentro de createSaler() se crea el detalle de la venta.
  //       this.createSale();
  //     },
  //     (err) => console.error('Error al obtener el username en ngOnInit ' + err)
  //   );
  // }

  createOrder() {
    // id_order no importa porque en la db es autonumerico
    // this.order.id_user = this.idUser; // obtengo el id_user
    // console.log('ID DE USUARIO EN ORDEN: ' + this.order.id_user);
    // this.order.order_date = this.currentDate;
    // this.order.total_price = this.total;
    // se crea la orden de compra
    this.orderService.createOrder(this.order).subscribe(
      (res) => {
        console.log('La orden fue creada exitosamente');
        // se crea el detalle de la orden de compra
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
    this.sale.id_user = this.order.id_user;
    this.sale.total_price = this.order.total_price;
    this.sale.date = this.order.order_date;
    // se crea la venta
    this.saleServices.createSale(this.sale).subscribe(
      (res) => {
        console.log('La venta fue creada');
        // se crea el detalle de venta
        this.createSaleDetail();
      },
      (err) => console.error('No se pudo crear la venta ' + err.error.message)
    );
  }
  // createSale() {
  //   this.sale.id_user = this.idUser;
  //   this.sale.total_price = this.total;
  //   this.sale.date = this.currentDate;
  //   // se crea la venta
  //   this.saleServices.createSale(this.sale).subscribe(
  //     (res) => {
  //       console.log('La venta fue creada');
  //       // se crea el detalle de venta
  //       this.createSaleDetail();
  //     },
  //     (err) => console.error('No se pudo crear la venta ' + err.error.message)
  //   );
  // }

  createSaleDetail() {
    let idSale;
    // antes de crear el detalle de venta, necesito obtener el id de la venta creada
    this.saleServices.getLastIdSale().subscribe(
      (res) => {
        idSale = res;
        // .lastIdSale porque en la query esta como as "lastIdSale"
        console.log('Ultimo idSale obtenido: ' + idSale.lastIdSale);

        for (const item of this.bookList) {
          this.saleDetail.id_book = item.id_book;
          this.saleDetail.id_sale = idSale.lastIdSale;
          this.saleDetail.price = item.price;
          this.saleDetail.quantity = item.quantity;
          // se crea el detalle de venta
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

}
