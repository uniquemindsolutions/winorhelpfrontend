import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
interface Room {
  id: string;
  name: string;
  description: string;
  createdBy: string;
}

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css'
})
export class RoomDetailComponent {

  room: Room = {
    id: '12345',
    name: 'Conference Room A',
    description: 'A room for holding conferences.',
    createdBy: 'Admin',
  };

  memberList:any=[];

}
