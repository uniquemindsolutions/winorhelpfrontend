import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';

export interface RoomList {
  sno:number;
  name: string;
  email: string;
  entryFee: number;
  totalParticipants: number;
  winningAmount: number;
}

const roomData: RoomList[] = [
  {
    "sno": 1,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 65,
    "totalParticipants": 82,
    "winningAmount": 1532,
  },
  {
    "sno": 2,
    "name": "Sandeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 52,
    "totalParticipants": 182,
    "winningAmount": 1743,
  },
  {
    "sno": 3,
    "name": "anij k",
    "email": "abc.1254@gmail.com",
    "entryFee": 26,
    "totalParticipants": 121,
    "winningAmount": 1178,
  },
  {
    "sno": 4,
    "name": "Manoj k",
    "email": "abc.1254@gmail.com",
    "entryFee": 58,
    "totalParticipants": 144,
    "winningAmount": 1700,
  },
  {
    "sno": 5,
    "name": "Kumar k",
    "email": "abc.1254@gmail.com",
    "entryFee": 58,
    "totalParticipants": 178,
    "winningAmount": 954,
  },
  {
    "sno": 6,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 79,
    "totalParticipants": 153,
    "winningAmount": 1632,
  },
  {
    "sno": 7,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 92,
    "totalParticipants": 166,
    "winningAmount": 1387,
  },
  {
    "sno": 8,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 18,
    "totalParticipants": 168,
    "winningAmount": 1883,
  },
  {
    "sno": 9,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 69,
    "totalParticipants": 100,
    "winningAmount": 1471,
  },
  {
    "sno": 10,
    "name": "Pradeep k",
    "email": "abc.1254@gmail.com",
    "entryFee": 23,
    "totalParticipants": 156,
    "winningAmount": 1253,
  }
]

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  displayedColumns: string[] = ['sno', 'name', 'email', 'entryFee', 'totalParticipants', 'winningAmount'];
  dataSource = roomData;
  constructor(public dialog: MatDialog) {}


}
