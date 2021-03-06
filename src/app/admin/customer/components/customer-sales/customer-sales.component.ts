import { Component, isDevMode, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
// PARA OBTENER EL ID de la orden ENVIADO EN LA URL DESDE user-purchases.component.html al pulsar boton "detalle"
import { ActivatedRoute, Params } from '@angular/router';
// services
import { SaleService } from './../../../../services/sale.service';
import { SaleDetailService } from './../../../../services/sale-detail.service';
import { BookService } from './../../../../services/book.service';
// modal
import { Sale } from './../../../../models/sale';
import { SaleDetail } from './../../../../models/saleDetail';
import { Book } from './../../../../models/book';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-sales',
  templateUrl: './customer-sales.component.html',
  styleUrls: ['./customer-sales.component.scss'],
})
export class CustomerSalesComponent implements OnInit {
  SERVER = 'http://localhost:3000';
  customerSales: Sale[] = [];
  customerSaleDetail: SaleDetail[] = [];
  bookArray: Book[] = [];
  actualPage: number = 1; // para el pagination
  // customerSales$: Observable<Sale[]>;

  constructor(
    private route: ActivatedRoute,
    public saleService: SaleService,
    public saleDetailService: SaleDetailService,
    public bookService: BookService
  ) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    // obtengo el id de la url
    this.route.params.subscribe((params: Params) => {
      console.log('id customer ' + params.idUser);
      // this.customerSales$ = this.saleService.getSalesByCustomerId(params.idUser);
      this.saleService.getSalesByCustomerId(params.idUser).subscribe(
        (res) => {
          this.customerSales = res;
        },
        (err) =>
          console.error(
            'Error al intentar obtener las ventas del cliente ' + err
          )
      );
    });
  }

  getSaleDetail(id_sale: number) {
    this.bookArray = []; // limpio array
    this.customerSaleDetail = []; // limpio array
    this.saleDetailService.getSaleDetail(id_sale).subscribe(
      (res) => {
        this.customerSaleDetail = res;
        // extraigo el id_book del detalle de venta para obtener toda la data del libro con getBookById
        this.customerSaleDetail.forEach((element) => {
          const idBook = element.id_book.toString();
          this.getBookById(idBook);
        });
      },
      (err) => console.error('Error al obtener el detalle de venta ' + err)
    );
  }

  getBookById(idBook: string) {
    this.bookService.getBookById(idBook).subscribe(
      (res) => {
        // limpio la url de la img
        res[0].url_image = this.linkImg(res[0].url_image);
        // cargando los libros en array bookArray
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
    const URL = this.SERVER + '/';
    const link = URL + str;
    return link;
  }
}
