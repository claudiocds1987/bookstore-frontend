import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  SERVER = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  // método para cargar el pago
  charge(cantidad, idToken) {
    // return this.http.post('http://localhost:4000/stripe_checkout', {
    //   // mismo nombre de variables en el backend nodejs
    //   stripeToken: idToken,
    //   cantidad: cantidad
    // }).toPromise();
    return this.http
      .post(`${this.SERVER}/stripe_checkout`, {
        // mismo nombre de variables en el backend nodejs
        stripeToken: idToken,
        cantidad: cantidad,
      })
      .toPromise();
  }
}
