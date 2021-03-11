import { Component, OnInit } from '@angular/core';
import { MyValidationsService } from '../../../services/my-validations.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
// formuluario
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  password2 = '';
  user = {} as User;
  // fecha local
  currentDate = new Date();
  message: string;
  usernameExist: boolean = false;
  emailExist: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public myValidationsService: MyValidationsService,
    public authService: AuthService,
    public userService: UserService,
    public alertService: AlertService,
    private router: Router
  ) {
    this.buildForm();

    this.checkEmail();

    this.checkUsername();
  }

  ngOnInit(): void {}

  buildForm() {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.MustMatch('password', 'confirmPassword'),
      }
    );
  }
  // convenienza getter para facil acceso a lo campos del formulario
  get f() {
    return this.form.controls;
  }

  checkEmail() {
    this.form
      .get('email')
      .valueChanges.pipe(
        debounceTime(450) // pasado este tiempo realiza la búsqueda en la db
      )
      .subscribe((value) => {
        console.log(value);
        this.userService.existUserEmail(value).subscribe((res) => {
          if (res) {
            this.emailExist = true; // email valido porque existe en la db
            //this.f.email.setValidators([Validators.email]);
          } else {
            this.emailExist = false; // email no valido, no existe en la db
          }
        }),
          (err) => console.error('Error en la db al verificar el email ' + err);
      });
  }

  checkUsername() {
    this.form
      .get('username')
      .valueChanges.pipe(
        debounceTime(350) // pasado este tiempo realiza la búsqueda en la db
      )
      .subscribe((value) => {
        console.log(value);
        this.userService.existUsername(value).subscribe((res) => {
          if (res) {
            // username valido porque existe en la db
            this.usernameExist = true; // para el boton registrar [disabled]
          } else {
            // username no valido, no existe en la db
            this.usernameExist = false; // para el boton registrar [disabled]
          }
        }),
          (err) =>
            console.error('Error en la db al verificar el username ' + err);
      });
  }

  deleteWhiteSpace(control: FormControl) {
    let value = control.value;
    value = this.myValidationsService.deleteWhiteSpice(value);
    control.setValue(value);
  }

  cleanUnnecessaryWhiteSpaces(control: FormControl) {
    let value = control.value;
    value = this.myValidationsService.cleanUnnecessaryWhiteSpaces(value);
    control.setValue(value);
  }

  signUp(event: Event) {
    event.preventDefault();
    this.submitted = true;
    if (this.form.valid) {
      // obtengo todos los valores del formulario
      this.user = this.form.value;
      this.user.username = this.form.get('username').value;
      this.user.registration_date = this.currentDate;
      this.user.pass = this.form.value['password'];
      // check si username existe en la db.
      this.userService.existUsername(this.user.username).subscribe((resp) => {
        if (resp === true) {
          this.alertService.showWarning(
            'Ya existe un usuario con el mismo nombre de usuario',
            ''
          );
          this.message = 'Ya existe un usuario con este nombre de usuario';
        } else {
          // check si email existe en la db.
          this.userService.existUserEmail(this.user.email).subscribe((resp) => {
            if (resp === true) {
              this.alertService.showWarning(
                'Ya existe un usuario con el mismo email',
                ''
              );
              this.message = 'Ya existe un usuario con este email';
            } else {
              // signup
              console.log('username e email permitidos');
              this.authService.userSignup(this.user).subscribe(
                (resp) => {
                  this.alertService.showSuccess(
                    'Gracias por registrarse',
                    'Registrado!'
                  );
                  // redirijo al login de usuario
                  this.router.navigate(['auth/login']);
                },
                (err) => {
                  alert(
                    'Ups error de servidor!\n\n' +
                      'no se pudo hacer el registro de usuario'
                  );
                  console.error(err.message);
                }
              );
            }
          });
        }
      });
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if validador ya ha encontrado un error en el control coincidente
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
