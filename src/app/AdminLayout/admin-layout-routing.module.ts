import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayout} from './admin-layout.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {UsersListComponent} from './UsersList/users-list.component';
import {RoomListComponent} from './Room/RoomList/room-list.component';
import {RoomDetailComponent} from './Room/RoomDetail/room-detail.component';

const routes: Routes = [
{ path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
{
    path: '', component: AdminLayout, 
    // path: '', component: CustomerLayout, canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, },
      { path: 'user-list', component: UsersListComponent, },
      { path: 'room-list', component: RoomListComponent },
      { path: 'room-details', component: RoomDetailComponent },

      // { path: 'dashboard', loadChildren: () => import('./Dashboard/dashboard.component').then(m => m.DashboardComponent) },
      // { path: 'user-list', loadChildren: () => import('./UsersList/users-list.component').then(m => m.UsersListComponent) },
      // { path: 'room-list', loadChildren: () => import('./Room/room-list/room-list.component').then(m => m.RoomListComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }

