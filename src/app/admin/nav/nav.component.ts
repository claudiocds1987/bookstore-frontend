import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  adminEmail: string = '';
  admin = {} as Admin; // declaro un objeto Admin
  constructor(private router: Router) { }

  ngOnInit(): void {
    // esta localStorage se creó en la funcion login de admin-login.component.ts
    // tengo que utilizar JSON.parse para guardar la data de la sessionStorage en el objeto admin
    if (localStorage.getItem('adminData') !== null){
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }
  }

  logout(){
    localStorage.removeItem('adminData');
    this.router.navigateByUrl('admin-login');
  }

}
