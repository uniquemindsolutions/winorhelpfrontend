import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';

@Component({
  selector: 'app-mastervalue',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,CommonModule,FormsModule,ReactiveFormsModule  ],
  templateUrl: './mastervalue.component.html',
  styleUrl: './mastervalue.component.css'
})
export class MastervalueComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  dataSource:any=[];
  currentPage:number=1;
  perPage:number=0;
  tableData:any;
  winnerform!: FormGroup;
  constructor(public dialog: MatDialog, private api:AdminService, private muiService:MuiDialogService) {
  }
  ngOnInit(){
    this.getMasterdata();
   }
  
   getMasterdata(){
      this.api.getmasterdata().subscribe({
        next:(res:any) => {
          //console.log(res.data, 'getmasterdata');
          localStorage.setItem("refper",res.data[0].ref_per);
          console.log(localStorage.getItem('refper'), 'getmasterdata');
          this.dataSource=res.data;
        },
        error: (err: any) => {
  
        }
      })
  
    }

    onSubmit() {
      alert("ReactiveFormsModule ");
      console.log(this.dataSource,"ReactiveFormsModule"); // Replace with actual form submission logic


      this.api.masterdataUpdate(this.dataSource[0]).subscribe({
        next: (result:any) => {
          console.log("resultval",result);
        },
        error: (err: any) => {
          console.log("error",err);
        }
      })
   


    }

}
