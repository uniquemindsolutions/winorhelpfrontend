import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayout } from "./admin-layout.component";
import { NavBarComponent } from "./../Components/Navbar/nav-bar.component";
import { SideMenuComponent } from "./../Components/SideMenu/side-menu.component";
import {DashboardComponent} from './Dashboard/dashboard.component'
import {UsersListComponent} from './UsersList/users-list.component'
import {RoomListComponent} from './Room/RoomList/room-list.component';
import {AuthService} from './../Services/Auth.service';
import {AdminService} from './../Services/Admin.service';
import {RoomCreateComponent} from './Room/room-create/room-create.component';
import {RoomDetailComponent} from './Room/RoomDetail/room-detail.component';

@NgModule({
  declarations: [AdminLayout,NavBarComponent,SideMenuComponent],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule, MatSidenavModule,MatToolbarModule,RoomListComponent,DashboardComponent,RoomCreateComponent, UsersListComponent, RoomDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[AuthService, AdminService]

})
export class AdminLayoutModule { }
