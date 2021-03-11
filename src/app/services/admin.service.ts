import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private URL_API = 'http://localhost:4000/admins';
  API = 'http://localhost:4000/admin/login';

  constructor(private http: HttpClient) { }

  getAdmin(email:string, pass: string) {
    const state: boolean = true;
    // console.log(state, email, pass);
    return this.http.post<Admin[]>(this.API, {email, pass, state});
  }

}
