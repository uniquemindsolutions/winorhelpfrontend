import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import MuiDialogService from '../../../Services/MuiDialog.service';
import { AdminService } from '../../../Services/Admin.service';


interface RoomInfoModel {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  winningAmount: string;
  entryFee: string;
  totalParticipants: string;
  startDate: Date;
  endDate: Date;
  startTime: any;
  endTime: any;
  winner_id: string;
  status: string;
}

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule, CommonModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css'
})
export class RoomDetailComponent {
  winner: any = { name: 'John Doe', position: '1st Place', prize: 'rs. 500', image: './../../../../assets/images/win-gift.png' };
  room: RoomInfoModel = {
    id: '',
    roomId: "",
    roomName: "",
    date: "",
    winningAmount: "",
    entryFee: "",
    totalParticipants: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "",
    endTime: '',
    winner_id: '',
    status: ""
  };

  memberList: any = [];

  selectedId: any = '';
  winnerId: any = '';
  marquedisplay: boolean = false;
  isLoading = false;
  currentPage: any = "1";
  perPage: any = "100";
  userlist: any;
  roomId: any;

  constructor(private fb: FormBuilder, private muiDialog: MuiDialogService, private api: AdminService, private router: Router,
    private route: ActivatedRoute
  ) {
    // this.termForm = this.fb.group({
    //   content: ['']
    // });
  }
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.roomId = params['id'];
    });

    this.getRoomUserList();
    this.getRoomDetail();

    this.api.usersList(this.currentPage, this.perPage).subscribe({
      next: (res: any) => {
        console.log(res.data, 'userList');
        this.userlist = res.data;
      },
      error: (err: any) => {

      }
    })
  }

  stop() {
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
      this.marquedisplay = true;
      this.winnerId = this.selectedId.user_id;
      this.isLoading = false;
    }, 3000);
  }



  getRoomUserList() {
    const data = { "roomId": this.roomId };
    this.api.getroomUserList(data).subscribe({
      next: (res: any) => {
        console.log(res.data, 'resultUserlist');
        this.memberList = res.data;
      },
      error: (err: any) => {

      }
    })
  }


  getRoomDetail() {
    const data = { "roomId": this.roomId };
    this.api.getRoomDetail(data).subscribe({
      next: (res: any) => {
        console.log(res.data, 'resultUserlist');
        this.room = res.data;
      },
      error: (err: any) => {

      }
    })

  }

  refreshComponent() {
    location.reload();
    // this.router.navigateByUrl('/room-details', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([this.router.url]);
    // });
  }

}
