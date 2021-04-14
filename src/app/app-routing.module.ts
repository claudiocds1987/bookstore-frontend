import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { AdminPrincipalComponent } from './admin/admin-principal/admin-principal.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
// Guardianes
import { AdminGuard } from './admin.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        // carga al modulo con todos sus componentes
        loadChildren: () => import('./user/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./user/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'purchase',
        loadChildren: () => import('./user/purchase/purchase.module').then(m => m.PurchaseModule)
      },
      // {
      //   path: 'order',
      //   loadChildren: () => import('./user/order/order.module').then(m => m.OrderModule)
      // },
      {
        path: 'contact',
        loadChildren: () => import('./user/contact/contact.module').then(m => m.ContactModule)
      },
    ]
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AdminGuard],
    component: DashboardComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'admin-principal',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'admin-principal',
      //   canActivate: [AdminGuard],
      //   component: AdminPrincipalComponent
      // },
      {
        path: 'customer',
        canActivate: [AdminGuard],
        loadChildren: () => import('./admin/customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'book',
        loadChildren: () => import('./admin/book/book.module').then(m => m.BookModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./admin/sales/sales.module').then(m => m.SalesModule)
      }
    ]
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
