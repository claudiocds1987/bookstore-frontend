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
    // acordarse que el token por consola lo va a mostrar aunque refresque la pagina por estar en la localStorage
    return localStorage.getItem('token');
  }

}
