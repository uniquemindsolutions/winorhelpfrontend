import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomeServiceService } from '../../Services/custome-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mytransaction',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule,CommonModule],
  templateUrl: './mytransaction.component.html',
  styleUrl: './mytransaction.component.css'
})
export class MytransactionComponent {
  dataSource:any=[];
  displayedColumns: string[] = ['user_id', 'trans_type', 'amount', 'date'];
  constructor(public dialog: MatDialog, private customeservice:CustomeServiceService) {
  }

  ngOnInit(){
     this.getTranslist();
   }

   getTranslist(){
    this.customeservice.getTransList().subscribe({
      next:(res:any) => {
        console.log(res.data, 'getTranslist');
        
        this.dataSource=res.data;
      },
      error: (err: any) => {

      }
    })

  }

}
