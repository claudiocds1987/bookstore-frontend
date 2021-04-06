import {  Component, Input, OnInit } from '@angular/core';
import { OrderDetail } from '../../../../models/orderDetail';
import { Book } from '../../../../models/book';
declare var $: any; // para que funcione jquery

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {

  @Input() orderDetail: OrderDetail[] = [];
  @Input() books: Book[] = [];

  constructor() {}

  ngOnInit(): void {
    $('#myModal').modal('show');
  }

}
