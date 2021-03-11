import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
// services
import { SaleService } from './../../../../services/sale.service';

@Component({
  selector: 'app-annual-average-sales',
  templateUrl: './annual-average-sales.component.html',
  styleUrls: ['./annual-average-sales.component.scss'],
})
export class AnnualAverageSalesComponent implements OnInit {
  // Para unir el input number del html a la logica (fijarse en funcion filter)
  @ViewChild('searchValue', {static: true}) searchValue: ElementRef;
  // fecha local actual
  currentDate = new Date();
  currentYear: number = this.currentDate.getFullYear(); // año actual
  dataAverageAnnualSales: any[] = [];

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Promedio anual de ventas' },
    // si quisiera agregar mas data
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];

  // public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          ticks: {
            // Incluye signo dolar en la data del eje y
            callback: function(value) {
                return  '$ ' + value;
            }
          }
        },
        // {
        //   id: 'y-axis-0',
        //   position: 'left',
        // },
        // {
        //   scaleLabel: {
        //     display: true,
        //     labelString: 'Total recaudado',
        //   },
        // },
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(255,0,0,0.3)',
        //   },
        //   ticks: {
        //     fontColor: 'red',
        //   },
        // },
      ],
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
    {
      // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;


  constructor(public saleService: SaleService) {}

  ngOnInit(): void {
    this.getAverageAnnualSales();
  }

  public getAverageAnnualSales(){
    this.saleService.getAverageAnnualSales(this.currentYear).subscribe(
      (res) => {
        this.dataAverageAnnualSales = res;
        console.log('DATA ' + this.dataAverageAnnualSales);
        this.getMonths();
        this.getTotal();
      },
      (err) => console.error('Error al obtener las ventas del año. ' + err)
    );
  }

  refreshData(){
    // vaciando los arrays
    this.dataAverageAnnualSales = [];
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    // vuelvo a cargar la data
    this.getAverageAnnualSales();
 }

 public getMonths() {
  for (const item of this.dataAverageAnnualSales) {
    // item.mes porque en la query de la db es as Mes
    this.lineChartLabels = [...this.lineChartLabels, item.mes]; // eje x
  }
}

  public getTotal() {
    for (const item of this.dataAverageAnnualSales) {
      // lineChartData[0].data porque puedo tener varios data en el array this.lineChartData en mi caso
      // solo tengo un data sobre el eje "y" que es el total.
      this.lineChartData[0].data = [...this.lineChartData[0].data, item.promedio]; // eje y
    }
  }

  filter() {
    if (this.searchValue.nativeElement.value > this.currentYear) {
      alert('El año elegido no puede ser mayor al año actual');
      this.searchValue.nativeElement.value = this.currentYear;
    } else if (this.searchValue.nativeElement.value === 2020 || this.searchValue.nativeElement.value < 2021) {
      alert('No hay datos con respecto al año 2020 o años anteriores');
      this.searchValue.nativeElement.value = this.currentYear;
    } else {
      this.dataAverageAnnualSales = [];
      this.lineChartLabels = [];
      this.lineChartData[0].data = [];
      this.saleService.getAverageAnnualSales(this.searchValue.nativeElement.value).subscribe(
        (res) => {
          this.dataAverageAnnualSales = res;
          console.log('DATA ' + this.dataAverageAnnualSales);
          this.getMonths();
          this.getTotal();
        },
        (err) => console.error('Error al obtener las ventas del año. ' + err)
      );
    }
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
}
