import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthService } from './Services/Auth.service';
import {CustomerLayoutModule} from './CustomerLayout/customer-layout.module';
import {AdminLayoutModule} from './AdminLayout/admin-layout.module';
import {AuthLayoutsModule} from './AuthLayouts/auth-layouts.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  imports:      [ BrowserModule, FormsModule, NgbCollapseModule, CustomerLayoutModule,AdminLayoutModule, AuthLayoutsModule ],
  declarations: [ ],
  bootstrap:    [  ],
  providers:[{ provide: LocationStrategy, useClass: HashLocationStrategy , },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }, AuthService],
})
export class AppModule { }