import { Component, OnInit } from '@angular/core';
// services
import { SaleService } from './../../../../services/sale.service';
// importaciones para utilizar chart.js
import { ChartOptions, ChartType } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-provincias-top-sales',
  templateUrl: './provincias-top-sales.component.html',
  styleUrls: ['./provincias-top-sales.component.scss']
})
export class ProvinciasTopSalesComponent implements OnInit {

  topSales: any[] = [];
   // Pie
   public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  // public pieChartLabels: Label[] = ['Buenos Aires', 'Entre Rios', 'Santa Fe', 'Neuquen', 'Mendoza'];
  // public pieChartData: number[] = [300, 500, 100, 800, 1500]; // aca recaudado por provincia
  public pieChartLabels: Label[] = []; // provincias
  public pieChartData: number[] = []; // recaudacion por provincia
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.3)',
        'rgba(0,255,0,0.3)',
        'rgba(0,0,255,0.3)',
        'rgba(0,255,255,0.3)',
        'rgba(255,0,258,0.3)'
      ],
    },
  ];

  constructor(public saleService: SaleService) { }

  ngOnInit(): void {
    this.getProvinciasTopSales();
  }

  getProvinciasTopSales(){
    this.saleService.getProvinciasTopSales().subscribe(
      res => {
        this.topSales = res;
        this.addProvincias();
        this.addTakings();
      },
      err => console.error('Error al intentar obtener el top 5 sales de provincias.' + err)
    );
  }

  addProvincias(){
    for (const item of this.topSales){
      this.pieChartLabels = [...this.pieChartLabels, item.provincia];
    }
  }

  // recaudacion
  addTakings(){
    for (const item of this.topSales){
      this.pieChartData = [...this.pieChartData, item.recaudacion];
    }
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // changeLabels(): void {
  //   const words = ['hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
  //     'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
  //     'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
  //     'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
  //     'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny'];
  //   const randomWord = () => words[Math.trunc(Math.random() * words.length)];
  //   this.pieChartLabels = Array.apply(null, { length: 3 }).map(_ => randomWord());
  // }

  // addSlice(): void {
  //   this.pieChartLabels.push(['Line 1', 'Line 2', 'Line 3']);
  //   this.pieChartData.push(400);
  //   this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
  // }

  // removeSlice(): void {
  //   this.pieChartLabels.pop();
  //   this.pieChartData.pop();
  //   this.pieChartColors[0].backgroundColor.pop();
  // }

  changeLegendPosition(): void {
    this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }

}
