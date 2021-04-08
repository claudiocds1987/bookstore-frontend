import { Component, OnInit } from '@angular/core';
// services
import { SaleService } from './../../../../services/sale.service';
// importaciones para utilizar chart.js
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-top-sales',
  templateUrl: './top-sales.component.html',
  styleUrls: ['./top-sales.component.scss'],
})
export class TopSalesComponent implements OnInit {
  topSales: any[] = [];
  bookNames: string[] = [];
  quantity: number[] = [];
  chart = [];
  // ********************* variables para chart.js ********************************
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Cantidad de ventas',
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']; // books name
  public barChartLabels: Label[] = []; // datos sobre el eje x
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  // datos sobre el eje x
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Libros' },
    // si quiero mas datos sobre el eje y
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series C' } //
  ];
  // *************************************************************************************
  public barChartColors: Color[] = [
    { backgroundColor: '#0a6ebd' },
    // { backgroundColor: 'red' },
  ];

  constructor(public saleService: SaleService) {}

  ngOnInit(): void {
    this.getBookTopSales();
  }

  getBookTopSales(){
    this.saleService.getBookTopSales().subscribe(
      (res) => {
        this.topSales = res;
        this.addBookNames();
        this.addQuantitySales();
      },
      (err) => console.error('Error al obtener bookTopSales ' + err)
    );
  }

  addBookNames() {
    for (const item of this.topSales) {
      this.barChartLabels = [...this.barChartLabels, item.name];
    }
  }

  addQuantitySales() {
    for (const item of this.topSales) {
      // barChartData[0].data porque puedo tener varios data en el array this.barChartData en mi caso
      // solo tengo un data sobre el eje y que es la cantidad.
      // item.vendidos porque la query en nodejs tiene un as "vendidos"
      this.barChartData[0].data = [...this.barChartData[0].data, item.vendidos];
    }
  }

  refreshData(){
    // vaciando los array
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    // vuelvo a cargar la data
    this.getBookTopSales();
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  // public randomize(): void {
  //   // Only Change 3 values
  //   this.barChartData[0].data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     Math.random() * 100,
  //     56,
  //     Math.random() * 100,
  //     40,
  //   ];
  // }
}
