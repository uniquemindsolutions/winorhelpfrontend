import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayout} from './admin-layout.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {UsersListComponent} from './UsersList/users-list.component';
import {RoomListComponent} from './Room/RoomList/room-list.component';
import {RoomDetailComponent} from './Room/RoomDetail/room-detail.component';
import { TermscondComponent } from './termscond/termscond.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { WinnerpercentageComponent } from './winnerpercentage/winnerpercentage.component';
import { MastervalueComponent } from './mastervalue/mastervalue.component';
import { WinnersdataComponent } from './winnersdata/winnersdata.component';
import { WinnersdataDetailComponent } from './winnersdata-detail/winnersdata-detail.component';

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
      { path: 'term-cond', component: TermscondComponent },
      { path: 'privacy-policy', component: PrivacypolicyComponent },
      { path: 'winnerper', component: WinnerpercentageComponent },
      { path: 'masterdata', component: MastervalueComponent },
      { path: 'winnersdata', component: WinnersdataComponent },
      { path: 'winnersdatadetails', component: WinnersdataDetailComponent },

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

