import { Component, Input, OnInit } from '@angular/core';
import { OrderDetail } from '../../../../models/orderDetail';
import { Book } from '../../../../models/book';
declare var $: any; // para que funcione jquery

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input() orderDetail: OrderDetail[] = [];
  @Input() books: Book[] = [];


  constructor() {}

  ngOnInit(): void {
    $('#myModal').modal('show');
  }

}
