import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) { 

    if (!isDevMode()) {
			this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
		}

  }

  getAdmin(email:string, pass: string) {
    const state: boolean = true;
    // console.log(state, email, pass);
    return this.http.post<Admin[]>(`${this.SERVER}/admin/login`, {email, pass, state});
  }

}

