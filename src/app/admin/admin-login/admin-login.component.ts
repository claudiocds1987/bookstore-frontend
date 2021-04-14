import { Component, OnInit } from '@angular/core';
import { Admin } from './../../models/admin';
// formuluario
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
// services
// import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  form: FormGroup;
  admin = {} as Admin;
  adminExist: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    // public adminService: AdminService,
    private authService: AuthService,
    private router: Router
    ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  login(event: Event){
    event.preventDefault();
    if (this.form.valid){
      const email = this.form.get('email').value;
      const pass = this.form.get('password').value;
      this.authService.getAdmin(email, pass)
      .subscribe(data => {
        // si no obtuvo el admin
        if (data.length === 0){
          this.adminExist = false;
          console.log('no existe el administrador');
        }
        else{
          // creo un objeto admi tipo Admin, para guardar el resultado de authService
          let admi = {} as Admin;
          // cargo en el objeto admi la data del .subscribe
          data.forEach(element => {
            admi = element;
          });
          // Guardo el objeto admi en la sessionStorage
          // session/localStorage solo permiten guardar un string, como yo quiero guardar un objeto de tipo Admin
          // tengo que usar JSON.stringify(admi)
          localStorage.setItem('adminData', JSON.stringify(admi));
          // si por alguna razon la localStorage no se crea, la view dashboard al
          // estar protegida por un guardian no la va a mostrar. Ver en archivo admin.guards.ts
          // y ver en app-routing.module.ts en el path: 'dashboard' esta el guardian.
          this.router.navigateByUrl('dashboard');
        }
    });
    }
  }

}
