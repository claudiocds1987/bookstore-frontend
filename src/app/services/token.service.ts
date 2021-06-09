import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string){
    localStorage.setItem('token', token);
    console.log('se guardo el token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

}
