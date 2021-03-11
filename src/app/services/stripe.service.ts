import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) { }

  // método para cargar el pago
  charge(cantidad, idToken){
    return this.http.post('http://localhost:4000/stripe_checkout', {
      // mismo nombre de variables en el backend nodejs
      stripeToken: idToken,
      cantidad: cantidad
    }).toPromise();
  }
}
