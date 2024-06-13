import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLayoutsRoutingModule } from './auth-layouts-routing.module';
import { AuthService } from './../Services/Auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthLayoutsRoutingModule
  ],
  providers:[AuthService]
})
export class AuthLayoutsModule { }
