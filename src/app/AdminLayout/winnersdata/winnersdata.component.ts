import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-winnersdata',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,CommonModule],
  providers: [
    AdminService // Register the service here
  ],
  templateUrl: './winnersdata.component.html',
  styleUrl: './winnersdata.component.css'
})
export class WinnersdataComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  dataSource:any=[];
  currentPage:number=1;
  perPage:number=0;
  constructor(public dialog: MatDialog, private api:AdminService, private muiService:MuiDialogService) {
  }
  ngOnInit(){
    this.gerRoomList();
   }
  
    gerRoomList(){
      this.api.roomListWinners(this.currentPage,this.perPage).subscribe({
        next:(res:any) => {
          console.log(res.data, 'Roomlist');
          this.dataSource=res.data;
        },
        error: (err: any) => {
  
        }
      })
  
    }


    // getroomuserscount(roomId:any,entryFee:any){

    //   this.api.getRoomUsersList(roomId).subscribe({
    //     next: (res: any) => {
       
    //       const result= res.users.length*entryFee;
    //       return result;
         
    //     },
    //     error: (err: any) => {
  
    //     }
    //   })
    // }
   

}
