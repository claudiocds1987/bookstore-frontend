import { Component, OnInit } from '@angular/core';
import { SaleService } from './../../services/sale.service';
import { Admin } from 'src/app/models/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  admin = {} as Admin;
  // fecha local actual
  currentDate = new Date();
  currentYear: number = this.currentDate.getFullYear(); // año actual
  currentMonth: number = this.currentDate.getMonth() + 1; // mes actual importante + 1 porque getMonth empieza desde 0
  quantityCurrentMonthSales;
  quantityCurrentYearSales;
  currentMonthRevenue;
  currentYearRevenue;

  constructor(
    public saleService: SaleService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.countSalesFromCurrentMonth(this.currentYear, this.currentMonth);
    this.thisMonthRevenue(this.currentYear, this.currentMonth);
    this.countSalesFromCurrentYear(this.currentYear);
    this.thisYearRevenue(this.currentYear);

    if (localStorage.getItem('adminData') !== null){
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }
  }

  logout(){
    localStorage.removeItem('adminData');
    this.router.navigateByUrl('admin-login');
  }

  refreshData(){
    this.countSalesFromCurrentMonth(this.currentYear, this.currentMonth);
    this.thisMonthRevenue(this.currentYear, this.currentMonth);
    this.countSalesFromCurrentYear(this.currentYear);
    this.thisYearRevenue(this.currentYear);
  }

 countSalesFromCurrentMonth(year: number, month: number){
    this.saleService.countSalesFromMonth(year, month).subscribe(
      res => {
        // res[0].total porque en la query es 'select count(id_sale) as "total"
        this.quantityCurrentMonthSales = res[0].total;
      },
      err => console.error('Error al intentar obtener el total de ventas del mes actual ' + err)
    );
  }

  countSalesFromCurrentYear(year: number){
    this.saleService.countSalesFromYear(year).subscribe(
      res => {
        // res[0].total porque en la query es 'select count(id_sale) as "total"
        this.quantityCurrentYearSales = res[0].total;
      },
      err => console.error('Error al intentar obtener el total de ventas del mes actual ' + err)
    );
  }

  thisMonthRevenue(year: number, month: number){
    this.saleService.salesRevenueByYearAndMonth(year, month).subscribe(
      res => {
        // res[0].total porque en la query es 'select sum(total_price) as "total"
        this.currentMonthRevenue = res[0].total;
      },
      err => console.error('Error al intentar obtener el total de ventas del mes actual ' + err)
    );
  }

  thisYearRevenue(year: number){
    this.saleService.salesRevenueFromYear(year).subscribe(
      res => {
        // res[0].total porque en la query es 'select sum(total_price) as "total"
        this.currentYearRevenue = res[0].total;
      },
      err => console.error('Error al intentar obtener el total de ventas del mes actual ' + err)
    );
  }

  toSaleSection(){
    document.getElementById('sale-section').scrollIntoView({behavior: 'smooth'});
  }

  toBookSection(){
    document.getElementById('book-section').scrollIntoView({behavior: 'smooth'});
  }

  toCustomerSection(){
    document.getElementById('customer-section').scrollIntoView({behavior: 'smooth'});
  }

}
