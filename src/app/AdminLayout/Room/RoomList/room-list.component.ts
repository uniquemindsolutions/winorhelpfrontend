import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {RoomCreateComponent} from '../room-create/room-create.component'
import { AdminService } from '../../../Services/Admin.service';
import { RouterModule } from '@angular/router';

export interface RoomList {
  roomId: string;
  startDate: any;
  endDate: any;
  startime: any;
  endTime: any;
  entryFee: number;
  totalParticipants: number;
  winningAmount: number;
}

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'viewDetails'];
  dataSource:RoomList[]=[];
  currentPage:number=1;
  perPage:number=0;
  constructor(public dialog: MatDialog, private api:AdminService) {
  }

 ngOnInit(){
  this.gerRoomList();
 }

  gerRoomList(){
    this.api.roomList(this.currentPage,this.perPage).subscribe({
      next:(res:any) => {
        console.log(res.data, 'res.data;');
        
        this.dataSource=res.data;
      },
      error: (err: any) => {

      }
    })

  }


  openDialog() {
    const dialogRef = this.dialog.open(RoomCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
