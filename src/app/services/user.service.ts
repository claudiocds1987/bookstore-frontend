import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  fecha = new Date();
 // URL_API = 'http://localhost:4000/users';

  // objeto vacio tipo User
  // selectedUser: User = {
  //   idUser: 0,
  //   email: '',
  //   username: '',
  //   pass: '',
  //   registrationDate: this.fecha
  // };

  userArray: User[]; // array de tipo User

  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
			this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
		}
  }

  getUsers() {
    return this.http.get<User[]>(`${this.SERVER}/users`);
  }

  existUsername(username: string){
    // devuelve true o false
    return this.http.get(`${this.SERVER}/users/exist/username/` + username);
  }

  existUserEmail(email: string){
    // devuelve true o false
    return this.http.get(`${this.SERVER}/users/exist/email/` + email);
  }

  getUserByUserName(username: string) {
    // const a = username;
    return this.http.get<User[]>(`${this.SERVER}/users/${username}`);
  }

  // createUser(user: User) {
  //   // el usuario lo creo en auth.service
  //   return this.http.post(this.SERVER, user);
  // }

  updateUser(user: User){
    return this.http.put(`${this.SERVER}/users/${user.username}`, user);
  }

  deleteUser(username: string) {
    return this.http.delete(`${this.SERVER}/users/${username}`);
  }

}
