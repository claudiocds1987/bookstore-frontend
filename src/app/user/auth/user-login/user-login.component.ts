import { Component, OnInit } from '@angular/core';
import { MyValidationsService } from '../../../services/my-validations.service';
// formuluario
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { TokenService } from '../../../services/token.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';

import { debounceTime } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  //password: string;
  form: FormGroup;
  message: string;
  usernameExist: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    public myValidationsService: MyValidationsService,
    public authService: AuthService,
    public cartService: CartService,
    public router: Router,
    public tokenService: TokenService,
    public alertService: AlertService,
    public userService: UserService
  ) {
    this.buildForm();
    // para verificar el username en la db reactivamente
    this.form.get('username').valueChanges
    .pipe(
      debounceTime(350) // pasado este tiempo realiza la búsqueda en la db
    )
    .subscribe(value => {
      console.log(value);
      this.userService.existUsername(value)
      .subscribe(res => {
        if(res){
          // username valido porque existe en la db
          this.usernameExist = true;
          // add clase is-valid al input
          // let element = document.getElementById("input-username");
          // element.classList.remove('is-invalid');
          // element.classList.add('is-valid');        
        }else{
           // username no valido, no existe en la db
          this.usernameExist = false; 
          // add clase is-invalid al input
          // let element = document.getElementById("input-username");
          // element.classList.remove('is-valid');
          // element.classList.add('is-invalid');      
        }     
      }),
      err => console.error('Error en la db al verificar el username ' + err);
    });

  }

  ngOnInit(): void {
    // localStorage.clear(); // borra todas las localStorage
    // al entrar a login, si hay un usuario logeado, hago logout borrando la locastorage
    if (localStorage.getItem('username') != null) {
      // borra el username de main-nav si no hay refresh la pagina
      this.authService.username.next('');
      // borrando cantidad de items en el boton del carrito de main-nav si no hay refresh
      this.cartService.cart.next([]);
      // borrando las localStorage
      localStorage.removeItem('username');
      this.alertService.showInfo('Sesión cerrada', '');
      // borrando localStorage shoppingCart
      if (localStorage.getItem('shoppingCart') != null) {
        localStorage.removeItem('shoppingCart');
        console.log('localStorage del shopping cart eliminada')
      }

      // borrando la localStorage idBooks
      if (localStorage.getItem('idBooks') != null) {
        localStorage.removeItem('idBooks');
        console.log('localStorage con array de idBooks eliminada');
      }

      // borrando la localStorage token
      if (localStorage.getItem('token') != null) {
        localStorage.removeItem('token');
        console.log('localStorage con el token eliminada');
      }

      // borrando al localstorage purchase
      if (localStorage.getItem('purchase') != null) {
        localStorage.removeItem('purchase');
        console.log('localStorage purchase eliminada');
      }

      if (localStorage.getItem('orderData') != null) {
        localStorage.removeItem('orderData');
        console.log('localStorage orderData eliminada');
      }

    }

  }

  buildForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(15)]],
    });

  }

  // convenienza getter para facil acceso a lo campos del formulario 
  get f() {
    return this.form.controls;
  }

  cleanUnnecessaryWhiteSpaces(cadena: string) {
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }

  login(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const name = this.form.get('username').value;
      const password = this.form.get('password').value;
      this.authService.loginUser(name, password)
        .subscribe(
          res => {
            console.log('Autorizado: ' + JSON.stringify(res.username));
            this.message = null;
            // const username = JSON.stringify(res.username);
            // console.log(username);
            this.alertService.showSuccess(`Bienvenido ${res.username}`, 'Login exitoso!');
            this.router.navigate(['home']);
          },
          err => {
            console.error('Acceso denegado ' + err.message);
            // borro localStorage
            if (localStorage.getItem('token') != null) {
              localStorage.removeItem('token');
              console.log('se borro la localStorage token');
            }
            this.alertService.showError('Nombre de usuario y/o contraseña incorrectos','');
            this.message = 'Nombre de usuario y/o contraseña incorrectos';
          }
        )

    }
  }


}
