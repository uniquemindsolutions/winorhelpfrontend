import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../../Services/Admin.service';
import { CustomeServiceService } from '../../Services/custome-service.service';

@Component({
  selector: 'app-transhist',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule,CommonModule],
  templateUrl: './transhist.component.html',
  styleUrl: './transhist.component.css',
  providers:[AdminService]
})
export class TranshistComponent {
  dataSource:any=[];
  displayedColumns: string[] = ['user_id', 'trans_type', 'amount', 'date'];
  walletamount:any;
  constructor(public dialog: MatDialog, private customeservice:CustomeServiceService,private admin: AdminService) {
  }

  ngOnInit(){
     this.getTranslist();
     const data = {"user_id": localStorage.getItem('user_id')}
     this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      localStorage.setItem("walletamount",res.data.wallet_amount);
      console.log(res.data, "res test")
      this.walletamount=res.data.wallet_amount;

      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
   }

   getTranslist(){
    this.admin.getallTransList().subscribe({
      next:(res:any) => {
        console.log(res.data, 'getTranslist');
        
        this.dataSource=res.data;
      },
      error: (err: any) => {

      }
    })

  }

}
