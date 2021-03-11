import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { NavComponent } from './admin/nav/nav.component';
import { AdminPrincipalComponent } from './admin/admin-principal/admin-principal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './admin/footer/footer.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { HeaderComponent } from './user/header/header.component';
import { UserFooterComponent } from './user/user-footer/user-footer.component';
import { MaterialModule } from './material/material.module';
import { MainNavComponent } from './user/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BannerComponent } from './user/banner/banner.component';
import { NgxPaginationModule } from 'ngx-pagination'; // para los pagination

// -------------INTERCEPTOR PARA EL TOKEN------------------------------------------------------
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
// abajo de todo en providers tambien se agregaron lineas de código
// ---------------------------------------------------------------------------------
// INTERCEPTOR PARA SPINNER/LOADER EN CADA PETICION HTTP
import { InterceptorService } from './services/interceptor.service';
// ---------------------------------------------------------------------------------
// TOASTR PARA ALERTS
import { ToastrModule } from 'ngx-toastr';
// Este componente es el que se va a mostrar para el MatDialog de Angular Material
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
// imports para el funcionamiento del spinner/loader para peticiones http
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    NavComponent,
    AdminPrincipalComponent,
    FooterComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    HeaderComponent,
    UserFooterComponent,
    MainNavComponent,
    BannerComponent,
    MatConfirmDialogComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ToastrModule.forRoot() // ToastrModule added,
  ],
  providers: [
    {
      // interceptor para el token
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      // interceptor para el spinner/loader de cada peticion HTTP
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatConfirmDialogComponent] // para que cuando se llame a matDialog, muestre el componente mat-confirm-dialog.component
})
export class AppModule { }
