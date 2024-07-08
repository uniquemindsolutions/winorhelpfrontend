import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { AdminService } from '../../Services/Admin.service';
import { PaymemtComponent } from './Paymemt/paymemt.component';
import { NewUserComponent } from './NewUser/new-user.component';

export interface RoomList {
  sno:number;
  name: string;
  email: string;
  phone: number;
  email_veri: any;
  ref_code: any;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatButtonModule, MatDialogModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  displayedColumns: string[] = ['sno', 'name','UserID', 'email', 'phone', 'email_veri', 'ref_code', 'status','room_allot','debit_action','credit_action'];
  dataSource :RoomList[]=[];
  currentPage:number=1;
  perPage:number=0;

  constructor(public dialog: MatDialog, private api:AdminService) {
  }

 ngOnInit(){
  this.gerUsersList();
 }

  gerUsersList(){
    this.api.usersList(this.currentPage,this.perPage).subscribe({
      next:(res:any) => {
        this.dataSource=res.data;
      },
      error: (err: any) => {

      }
    })
  }

  openDialog(item:any, action:string) {
   // alert("Hii");
    const dialogRef = this.dialog.open(PaymemtComponent, {data:{item, action}, width:'40%'});
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addUsers() {
    const dialogRef = this.dialog.open(NewUserComponent, {width:'40%'});
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
      this.gerUsersList();
    });
  }


}
