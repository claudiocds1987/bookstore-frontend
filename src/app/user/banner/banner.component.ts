import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
// array de tipo string
  images: string[] = [
    'assets/images/banner-nature.jpg',
    //'assets/images/banner-img-1.jpg',
    //'assets/images/banner1.jpg',
    'assets/images/banner3.jpg',
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
