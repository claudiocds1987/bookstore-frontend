import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';
import { tap } from 'rxjs/operators';
import { TokenService } from './../services/token.service';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  SERVER = 'http://localhost:3000';

  public username = new BehaviorSubject<string>('');
  public username$ = this.username.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  getAdmin(email: string, pass: string) {
    const state: boolean = true;
    return this.http.post<Admin[]>(`${this.SERVER}/admin/login`, {
      email,
      pass,
      state,
    });
  }

  // registro de usuario
  userSignup(user: User) {
    return this.http.post(`${this.SERVER}/api/auth/signup/user`, user);
  }

  loginUser(username: string, password) {
    return this.http
      .post(`${this.SERVER}/api/auth/signin/user`, { username, password })
      .pipe(
        tap((data: any) => {
          const token = data.token;
          const name = data.username;
          this.username.next(name);
          // guardo el username en localStorage para ser invocada en component main-nav
          localStorage.setItem('username', name);
          this.tokenService.saveToken(token);
        })
      );
  }
}
