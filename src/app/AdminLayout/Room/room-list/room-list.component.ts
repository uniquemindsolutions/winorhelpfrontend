import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {RoomCreateComponent} from './../room-create/room-create.component'

export interface RoomList {
  sno:number;
  roomId: string;
  date: string;
  entryFee: number;
  totalParticipants: number;
  winningAmount: number;
  viewDetails: string;
}

const roomData: RoomList[] = [
  {
    "sno": 1,
    "roomId": "room_001",
    "date": "2024-06-10",
    "entryFee": 65,
    "totalParticipants": 82,
    "winningAmount": 1532,
    "viewDetails": "http://example.com/room_001"
  },
  {
    "sno": 2,
    "roomId": "room_002",
    "date": "2024-06-11",
    "entryFee": 52,
    "totalParticipants": 182,
    "winningAmount": 1743,
    "viewDetails": "http://example.com/room_002"
  },
  {
    "sno": 3,
    "roomId": "room_003",
    "date": "2024-06-12",
    "entryFee": 26,
    "totalParticipants": 121,
    "winningAmount": 1178,
    "viewDetails": "http://example.com/room_003"
  },
  {
    "sno": 4,
    "roomId": "room_004",
    "date": "2024-06-13",
    "entryFee": 58,
    "totalParticipants": 144,
    "winningAmount": 1700,
    "viewDetails": "http://example.com/room_004"
  },
  {
    "sno": 5,
    "roomId": "room_005",
    "date": "2024-06-14",
    "entryFee": 58,
    "totalParticipants": 178,
    "winningAmount": 954,
    "viewDetails": "http://example.com/room_005"
  },
  {
    "sno": 6,
    "roomId": "room_006",
    "date": "2024-06-15",
    "entryFee": 79,
    "totalParticipants": 153,
    "winningAmount": 1632,
    "viewDetails": "http://example.com/room_006"
  },
  {
    "sno": 7,
    "roomId": "room_007",
    "date": "2024-06-16",
    "entryFee": 92,
    "totalParticipants": 166,
    "winningAmount": 1387,
    "viewDetails": "http://example.com/room_007"
  },
  {
    "sno": 8,
    "roomId": "room_008",
    "date": "2024-06-17",
    "entryFee": 18,
    "totalParticipants": 168,
    "winningAmount": 1883,
    "viewDetails": "http://example.com/room_008"
  },
  {
    "sno": 9,
    "roomId": "room_009",
    "date": "2024-06-18",
    "entryFee": 69,
    "totalParticipants": 100,
    "winningAmount": 1471,
    "viewDetails": "http://example.com/room_009"
  },
  {
    "sno": 10,
    "roomId": "room_010",
    "date": "2024-06-19",
    "entryFee": 23,
    "totalParticipants": 156,
    "winningAmount": 1253,
    "viewDetails": "http://example.com/room_010"
  }
]

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'viewDetails'];
  dataSource = roomData;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(RoomCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
