import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyValidationsService {

  constructor() { }

  cleanUnnecessaryWhiteSpaces(cadena: string){
    return cadena.replace(/\s{2,}/g, ' ').trim();
  }

  getImage(cadena: string){
    return cadena.replace('\\', '/');
  }

  // covierte solo la 1er letra de la palabra/palabras a mayuscula
  textCapitalize(str: string){
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // recibe una cadena, convierte la 1er letra en mayúscula, las demas en minúsculas
  firstLetterUpperCase (str: string){
    const mayus = str.substring(0, 1).toUpperCase();
    const resto = str.substring(1, str.length).toLowerCase();
    return mayus.concat(resto.toString());
  }

  deleteWhiteSpice(str: string){
    const word = str.split(/\s/).join('');
    return word;
  }

}
