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
          // sessionStorage solo permite guardar un string, como yo quiero guardar un objeto de tipo Admin
          // tengo que usar JSON.stringify(admi)
          sessionStorage.setItem('adminData', JSON.stringify(admi));
          this.router.navigateByUrl('dashboard');
        }
    });
    }
  }

}
