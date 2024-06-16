import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerLayoutRoutingModule } from './customer-layout-routing.module';
import { CustomerLayout } from "./customer-layout.component";
import { HeaderComponent } from "./../Components/Header/header.component";
import { FooterComponent } from "./../Components/Footer/footer.component";

@NgModule({
  declarations: [CustomerLayout],
  imports: [
    CommonModule,
    CustomerLayoutRoutingModule, HeaderComponent, FooterComponent
  ]
})
export class CustomerLayoutModule { }
