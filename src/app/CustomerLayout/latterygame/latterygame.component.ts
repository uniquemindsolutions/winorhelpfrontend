import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, interval } from 'rxjs';
// import { WebSocketService } from '../../services/websocket.service';
import { WebsocketService } from '../websocket.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../Services/Admin.service';
import { Room } from './room.model';

@Component({
  selector: 'app-timergame',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule,
    MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,FormsModule,
  ],
  providers:[AdminService],
  templateUrl: './latterygame.component.html',
  styleUrls: ['./latterygame.component.css']
})
export class LatterygameComponent implements OnInit, OnDestroy {
  private websocketSubscription: Subscription | undefined;
  private countdownSubscription: Subscription | undefined;
  public room: Room = {
    id: 1,
    name: 'Room 1',
    latter_datetime:'',
    lotteryDate: new Date(),
    users: [],
    manualWinners: [],
    winners: [],
    currentRound: 0,
    scrolling: true
  };
  public gameview: boolean = false;
  public gameviewWinners: boolean = false;
  public winnerlistfinal: any[] = [];
  public currentScrollingUserIndex: number = 0;
  public isLoading: boolean = true;
  displayedColumns: string[] = ['username', 'user_id'];
  totalNoOfRoundGame:number=0;

  public roomInfo: any = JSON.parse(atob(sessionStorage.getItem(`${environment.STORAGE_KEY}/roomDetail`) || '') || '{}');

  constructor(private webSocketService: WebsocketService, private cdr: ChangeDetectorRef,private api:AdminService) { }

  ngOnInit(): void {
    this.initWebSocket();
    this.getRoomState();
  }

  initWebSocket(): void {
    this.websocketSubscription = this.webSocketService.getMessages().subscribe(message => {
      if (message.type === 'GAME_STATE_UPDATE') {
        this.handleGameStateUpdate(message.data);
      }
    });
  }

  // this.api.getRoomUsersList(this.roomInfo.roomId).subscribe({
  //   next: (res: any) => {
  //   },
  //   error: (err: any) => {
  //     //this.isLoading = false;
  //   }
   //})
   getRoomState(): void {
    this.api.getroomdata(this.roomInfo.roomId).subscribe({
      next: (data: any) => {
                this.gameview=true;
                this.handleGameStateUpdate(data);
                this.startCountdown();
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    });
   }

  // getRoomState(): void {
  //   fetch('/api/game-state')
  //     .then(response => response.json())
  //     .then(data => {
  //       this.handleGameStateUpdate(data);
  //       this.startCountdown();
  //     });
  // }

  startCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = interval(1000).subscribe(() => {

      // this.selectWinnerForRound();
      this.api.selectWinner(this.roomInfo.roomId, this.roomInfo.manualWinners).subscribe(response => {
        console.log('Winner selected successfully', response);
      });

      this.totalNoOfRoundGame=0;
      if(this.roomInfo && this.roomInfo.winingPercentageInfo){
          let temp:any=JSON.parse(this.roomInfo.winingPercentageInfo);
          this.totalNoOfRoundGame=temp.length;
      }

      if(this.room.winners.length==this.totalNoOfRoundGame){
       // this.isRoundComplited=true;
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe(); // Properly unsubscribe from the interval
        }
      }


      this.updateCountdown();
    });
  }

  updateCountdown(): void {

    if (!(this.room.latter_datetime instanceof Date)) {
      this.room.latter_datetime = new Date(this.room.latter_datetime);
    }
    
    const now = new Date().getTime();
    const distance = this.room.latter_datetime.getTime() - now;

    if (distance <= 0) {
      this.room.currentRound++;
      this.room.lotteryDate = new Date(now + 600000); // Update to next round's start time
      this.room.scrolling = true;
      // Implement round logic and trigger game updates
    } else {
      console.log("timeremain",this.room)
      this.room.timeRemaining = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    }
    this.cdr.detectChanges();
  }

  handleGameStateUpdate(data: any): void {
    console.log("data",data);
    this.room = data.data.room;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
