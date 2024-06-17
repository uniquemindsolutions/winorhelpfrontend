import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../Services/Admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import MuiDialogService from '../../Services/MuiDialog.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gameview',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,CommonModule],
  providers: [
    AdminService // Register the service here
  ],
  templateUrl: './gameview.component.html',
  styleUrl: './gameview.component.css'
})
export class GameviewComponent {
  winner:any={ name: 'John Doe', position: '1st Place', prize: 'rs. 500', image: './../../../../assets/images/win-gift.png' };
  room: any = {
    id: '12345',
    name: 'Conference Room A',
    description: 'A room for holding conferences.',
    createdBy: 'Admin',
  };
  id: any;

  selectedId:any='';
  winnerId:any='';
  marquedisplay:boolean=false;
  isLoading = false;
  currentPage:any="1";
  perPage:any="100";
  userlist:any;
  memberList:any=[];
  roomDetails:any;

  constructor(private route: ActivatedRoute, private api:AdminService,private fb: FormBuilder,  private muiDialog: MuiDialogService) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.getRoomUserList();

    this.api.usersList(this.currentPage,this.perPage).subscribe({
      next:(res:any) => {
        console.log(res.data, 'userList');
        this.userlist=res.data;
      },
      error: (err: any) => {

      }
    })

    this.getRoomDetails();

  }



   
   stop(){
    this.selectIdBasedOnTimestamp();
   }

   selectIdBasedOnTimestamp() {
    this.isLoading = true;
    setTimeout(() => {
    // Simulate fetching a timestamp and selecting an ID based on it
    const currentTimestamp = new Date().getSeconds(); // Using seconds for simplicity
    //const currentTimestamp=1;
    const index = currentTimestamp % this.memberList.length;
    this.selectedId = this.memberList[index];
    this.marquedisplay=true;
    this.winnerId=this.selectedId.user_id;
    this.isLoading = false;
  }, 3000);
  }
   getRoomUserList(){
   
    this.api.getroomUserList().subscribe({
      next:(res:any) => {
        // console.log(res.data, 'roomdetails');
        this.memberList=res.data;
      },
      error: (err: any) => {
  
      }
    })

   }

   getRoomDetails(){
    const roomId={"roomId":this.id}
    console.log(roomId,"roomdetails")
    this.api.getRoomDetail(roomId).subscribe({
      next:(res:any) => {
        console.log(res, 'roomdetails');
        this.roomDetails=res[0];
      },
      error: (err: any) => {
  
      }
    })

   }
}
