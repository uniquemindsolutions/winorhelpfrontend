import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './CustomerLayout/Home/home.component';
// import { LoginComponent } from './AuthLayouts/Login/login.component';
// import { RegistraionComponent } from './AuthLayouts/Registraion/registraion.component';
// import { ContactComponent } from './CustomerLayout/Contact/contact.component';
// import { ListofwinComponent } from './CustomerLayout/Listofwin/listofwin.component';

import { AuthGuard } from "./auth.guard";
import { HomeComponent } from './CustomerLayout/Home/home.component';
export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./AuthLayouts/auth-layouts.module').then(m => m.AuthLayoutsModule) },
    { path: 'admin', loadChildren: () => import('./AdminLayout/admin-layout.module').then(m => m.AdminLayoutModule) },
    { path: '', loadChildren: () => import('./CustomerLayout/customer-layout.module').then(m => m.CustomerLayoutModule) },
    // { path: '**', redirectTo: 'login' }
];
