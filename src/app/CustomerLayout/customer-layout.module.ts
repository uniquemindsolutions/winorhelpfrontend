import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerLayoutRoutingModule } from './customer-layout-routing.module';
import { CustomerLayout } from "./customer-layout.component";
import { HeaderComponent } from "./../Components/Header/header.component";
import { FooterComponent } from "./../Components/Footer/footer.component";
import { CreditdbitComponent } from './creditdbit/creditdbit.component';

@NgModule({
  declarations: [CustomerLayout],
  imports: [
    CommonModule,
    CustomerLayoutRoutingModule, HeaderComponent, FooterComponent,CreditdbitComponent
  ]
})
export class CustomerLayoutModule { }
