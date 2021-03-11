import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  fecha = new Date();
  URL_API = 'http://localhost:4000/users';

  // objeto vacio tipo User
  // selectedUser: User = {
  //   idUser: 0,
  //   email: '',
  //   username: '',
  //   pass: '',
  //   registrationDate: this.fecha
  // };

  userArray: User[]; // array de tipo User

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.URL_API);
  }

  existUsername(username: string){
    // devuelve true o false
    return this.http.get('http://localhost:4000/users/exist/username/' + username);
  }

  existUserEmail(email: string){
    // devuelve true o false
    return this.http.get('http://localhost:4000/users/exist/email/' + email);
  }

  getUserByUserName(username: string) {
    // const a = username;
    return this.http.get<User[]>(`${this.URL_API}/${username}`);
  }

  createUser(user: User) {
    // creo usuario en postgresql con "post"
    return this.http.post(this.URL_API, user);
  }

  updateUser(user: User){
    return this.http.put(`${this.URL_API}/${user.username}`, user);
  }

  deleteUser(username: string) {
    return this.http.delete(`${this.URL_API}/${username}`);
  }

}
