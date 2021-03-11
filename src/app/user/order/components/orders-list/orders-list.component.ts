import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from '../../../../services/order.service';
import { UserService } from '../../../../services/user.service';
import { AlertService } from '../../../../services/alert.service';
import { OrderDetail } from 'src/app/models/orderDetail';

// ??????????????????????
import { OrderDetailService } from '../../../../services/order-detail.service';
import { BookService } from '../../../../services/book.service';
import { Book } from 'src/app/models/book';
// ??????????????????????
declare var $: any; // para que funcione jquery

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  constructor(
    public orderService: OrderService,
    public userService: UserService,
    public alertService: AlertService,
    public orderDetailService: OrderDetailService, // ????
    public bookService: BookService // ???
  ) { }

  ordersArray: Order[] = []; // ordersArray para hacer el .filter cuyo resultado se guarda en filterOrdersArray
  filterOrdersArray: Order[] = [];
  userArray: User[] = []; 
  date1: Date;
  date2: Date;
  btnDisabled: boolean = true;
  message = 'No se encontraron resultados'; 
  actualPage: number = 1 // para pagination

  // ???????????????
  orderDetailArray: OrderDetail[] = [];
  bookArray: Book[] = [];
  // ???????????????

  ngOnInit(): void {
     // localStorage 'username' fue creada en auth.service.ts funcion loginUser() cuando hizo login en user-login.component.ts
     const username = localStorage.getItem('username');
     this.getOrders(username);
  }

  getOrders(username: string) {
    // antes de obtener las orders traigo la data del usuario 
    this.userService.getUserByUserName(username)
      .subscribe(res => {
        console.log('res: ' + JSON.stringify(res));
        this.userArray = res; // obtengo la data del usuario
        // paso el id_user porque en orders el user se identifica con su id
        this.getOrdersByUserId(this.userArray[0].id_user);
      },
        err => console.error('Error al obtener el username en ngOnInit ' + err)
      );
  }

  getOrdersByUserId(idUser: number) {
    this.orderService.getOrdersByUserId(idUser)
      .subscribe(res => {
        // res lo guardo en los 2 array porque si se hace filterOrdersByDate() necesito filtrar array ordersArray
        // cuyo resultado lo guardo en array filterOrdersArray
        this.ordersArray = res;
        this.filterOrdersArray = res;
      },
        err => console.error('No se pudo obtener las ordenes de compra del usuario ' + err)
      );
  }

  filterOrdersByDate() {
    if (this.date1 === undefined || this.date2 === undefined) {
      this.alertService.showWarning('Debe elegir un rango de fecha', '');
    }
    else if(this.date1 > this.date2){
      this.alertService.showError('Fecha 1 no puede ser mayor a Fecha 2', 'ERROR DE FECHAS');
    }

    else {
      this.btnDisabled = false; // se habilita btn listar todos
      const startDate = new Date(this.date1);
      const endDate = new Date(this.date2);
      // obteniendo las ordenes por fecha en el array filterOrdersArray
      this.filterOrdersArray = this.ordersArray.filter(a => {
        const date = new Date(a.order_date);
        return date >= startDate && date <= endDate;
      })
    }
  }

  listAllOrders() {
    this.btnDisabled = true; // deshabilito btn listar todos
    this.date1 = undefined;
    this.date2 = undefined;
    this.getOrdersByUserId(this.userArray[0].id_user);
  }


  getDetalle(id_order: number){
    this.orderDetailArray = [];
    this.orderDetailService.getOrderDetail(id_order).subscribe(
      res => {
        this.orderDetailArray = res;
        // recorro el array
        this.orderDetailArray.forEach(element => {
          const idBook = element.id_product.toString();
          // Obtengo el libro
          this.getBookById(idBook);
        });
        $('#myModal').modal('show');
      },
      err => console.error('error al obtener el order_detail ' + err)
    );
  }

  getBookById(idBook: string) {
    this.bookArray = [];
    this.bookService.getBookById(idBook).subscribe(
      (res) => {
        res[0].url_image = this.linkImg(res[0].url_image);
        this.bookArray.push(...res);
      },
      (err) => console.error('error al intentar obtener el libro por id ' + err)
    );
  }

  linkImg(urlImage) {
    // quito la palabra public
    let str = urlImage.replace(/public/g, '');
    // quito la barra '\'
    str = str.replace('\\', '');
    // invierto la barra en sentido a '/'
    str = str.replace('\\', '/');
    // console.log(str);
    const URL = 'http://localhost:4000/';
    const link = URL + str;
    // console.log(link);
    return link;
  }
}

