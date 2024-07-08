import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-winnerpercentage',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,CommonModule,FormsModule,ReactiveFormsModule  ],
  templateUrl: './winnerpercentage.component.html',
  styleUrl: './winnerpercentage.component.css'
})
export class WinnerpercentageComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  dataSource:any=[];
  currentPage:number=1;
  perPage:number=0;
  tableData:any;
  winnerform!: FormGroup;
  constructor(public dialog: MatDialog, private api:AdminService, private muiService:MuiDialogService) {
  }
  ngOnInit(){
    this.gerRoomList();
   }
  
    gerRoomList(){
      this.api.winnerpecr(this.currentPage,this.perPage).subscribe({
        next:(res:any) => {
          console.log(res.data, 'Roomlist');
          
          this.dataSource=res.data;
        },
        error: (err: any) => {
  
        }
      })
  
    }

    onSubmit() {
      //alert("ReactiveFormsModule ");
      console.log(this.dataSource); // Replace with actual form submission logic


      this.api.roomwinerperUpdate(this.dataSource).subscribe({
        next: (result:any) => {
          console.log("resultval",result);
          //this.router.navigate(['/mytransaction']);
        },
        error: (err: any) => {
          console.log("error",err);
        }
      })
   


    }

}
