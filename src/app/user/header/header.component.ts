import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //isMenuCollapsed = false; // para que funcione el menú desplegable
  // @Output() public sidenavToogle = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


}
