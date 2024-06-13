import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayout } from "./customer-layout.component";
import { AuthGuard } from './../auth.guard';
import { HomeComponent } from './Home/home.component';
import { ListofwinComponent } from './Listofwin/listofwin.component';
import { ContactComponent } from './Contact/contact.component';

const routes: Routes = [
  {
    path: '', component: CustomerLayout,
    // path: '', component: CustomerLayout, canActivateChild: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'listofwin', component: ListofwinComponent },
      { path: 'contact', component: ContactComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerLayoutRoutingModule { }
