import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayout } from "./customer-layout.component";
import { AuthGuard } from './../auth.guard';
import { HomeComponent } from './Home/home.component';
import { ListofwinComponent } from './Listofwin/listofwin.component';
import { ContactComponent } from './Contact/contact.component';
import { CreditdbitComponent } from './creditdbit/creditdbit.component';
import { WithdrareqComponent } from './withdrareq/withdrareq.component';
import { MytransactionComponent } from './mytransaction/mytransaction.component';

const routes: Routes = [
  {
    path: '', component: CustomerLayout,
    // path: '', component: CustomerLayout, canActivateChild: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'listofwin', component: ListofwinComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'creditdebit', component: CreditdbitComponent },
      { path: 'withdraw', component: WithdrareqComponent },
      { path: 'mytransaction', component: MytransactionComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerLayoutRoutingModule { }
