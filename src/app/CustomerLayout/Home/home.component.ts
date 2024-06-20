import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../Services/Admin.service';
import MuiDialogService from '../../Services/MuiDialog.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CustomeServiceService } from '../../Services/custome-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatSlideToggleModule,CommonModule],
  providers: [
    AdminService // Register the service hereng 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  dataSource:any;
  currentPage:number=1;
  perPage:number=0;
  walletAmount:any=100;
  constructor(public dialog: MatDialog, private muiService:MuiDialogService, private api:AdminService,
    private formBuilder: FormBuilder,
    private customeservice:CustomeServiceService,
    private router: Router
   ) {
  }

  ngOnInit(){
    if(localStorage.getItem('user_id')==''){
      this.router.navigate(['/auth/login']);
    }
    this.getRoomList();
    this.customeservice.getCurrentWalletAmount().subscribe({
      next:(res:any) => {
        console.log(res.data, 'currentAmount');
        this.walletAmount=res.data[0].wallet_amount
      },
      error: (err: any) => {

      }
    })
   }
  
   getRoomList(){
    
      this.api.roomList(this.currentPage,this.perPage).subscribe({
        next:(res:any) => {
          console.log(res.data, 'Roomlist');
          
          this.dataSource=res.data;
        },
        error: (err: any) => {
  
        }
      })
    
      
  
    }

    roomalocate(roomid:any){
     

      let text = "OK or Cancel";
  if (confirm(text) == true) {
    if(this.walletAmount>0){
      const data={"roomnumber":roomid,"user_id":localStorage.getItem('user_id')};
      this.customeservice.roomuserlistInsert(data).subscribe({
        next: (result:any) => {
          console.log("resultvalroominsert",result);
          //this.router.navigate(['/mytransaction']);
          alert("Added to room"+roomid);
        },
        error: (err: any) => {

        }
      })
    }else{
      alert("Wallet not having amount"+this.walletAmount);
    }
  } else {
    // text = "You canceled!";
  }

      
      

    }

}
