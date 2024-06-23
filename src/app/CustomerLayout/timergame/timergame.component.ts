import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Room, User } from '../room.model';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../Services/Admin.service';


@Component({
  selector: 'app-timergame',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  providers:[AdminService],
  templateUrl: './timergame.component.html',
  styleUrl: './timergame.component.css'
})
export class TimergameComponent {
  private countdownSubscription: Subscription | undefined;
  private scrollSubscription: Subscription | undefined;
  private _countdownSubscription: Subscription | undefined;
  public roundDuration = 6000; // 1 minute per round
  public roomInfo: any = JSON.parse(atob(sessionStorage.getItem(`${environment.STORAGE_KEY}/roomDetail`) || '') || '{}');
  winners:any=[];
  users:any=[];
  roomsInfo:any={};
  isLoading:boolean=true;
  totalNoOfRoundGame:number=0;
  isRoundComplited:boolean=false;
  
  room: Room = {
    id: 1,
    name: 'Room 1',
    lotteryDate: new Date(new Date(this.roomInfo.latter_datetime).getTime() + this.roundDuration),
    users: [],
    manualWinners: [],
    winners: [],
    currentRound: 0,
    scrolling: true
  };

  currentScrollingUserIndex: number = 0;

  constructor(private api:AdminService,private changeDetectorRef: ChangeDetectorRef,) {
    console.log(new Date(new Date(this.roomInfo.latter_datetime).getTime() + this.roundDuration), 'popat');

  }

  ngOnInit(): void {
    this.getRoomUsersList();
  }



  getRoomUsersList() {
    this.isLoading = true;
    let that = this;
    this.api.getRoomUsersList(this.roomInfo.roomId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.status && res.users.length) {
          that.isLoading = false;
          this.users = res.users;
          this.roomsInfo = res.roomsInfo;
          this.winners = [];
          if(this.roomsInfo['manuval_winners']){
            let win:any[]=JSON.parse(this.roomsInfo['manuval_winners']);
            for (let i = 0; i < win.length; i++) {
              this.winners.push({
                user_id:win[i],
                username:''
              })
            }
          }

          this.totalNoOfRoundGame=0;
          if(this.roomsInfo && this.roomsInfo['winingPercentageInfo']){
              let temp:any=JSON.parse(this.roomsInfo['winingPercentageInfo']);
              this.totalNoOfRoundGame=temp.length;
          }

          this.addUsernameAndRemoveMatchingItems();
          this.startCountdown();
          this.startScrolling();
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    })
  }


  addUsernameAndRemoveMatchingItems(): void {
    this.winners.forEach((itemB: any) => {
      const matchingItem = this.users.find((itemA: any) => Number(itemA.user_id) === Number(itemB.user_id));
      if (matchingItem) {
        itemB.username = matchingItem.username;
      }
    });

    this.winners.forEach((itemB: any) => {
      const index = this.users.findIndex((itemA: any) => Number(itemA.user_id) === Number(itemB.user_id));
      if (index !== -1) {
        itemB.username = this.users[index].username;
        this.users.splice(index, 1);
      }
    });
    this.room.users=this.users;
    this.changeDetectorRef.detectChanges();
  }

  startCountdown(): void {
    // this.updateCountdown();
   

    let timer=this.users.length * 2000;
    console.log(timer, 'timer');
    
    console.log(new Date(), 'AA');
    this._countdownSubscription = interval(timer).subscribe(() => {
      this.selectWinnerForRound();
      if(this.room.winners.length==this.totalNoOfRoundGame){
        this.isRoundComplited=true;
        if (this._countdownSubscription) {
          this._countdownSubscription.unsubscribe(); // Properly unsubscribe from the interval
        }
      }
    })

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown(timer);
      this.ifAutoWinnerSelectedThenRemoveFromList();
      if(this.room.winners.length==this.totalNoOfRoundGame){
        this.isRoundComplited=true;
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe(); // Properly unsubscribe from the interval
        }
      }
    });
  }

  startScrolling(): void {
    this.scrollSubscription = interval(2000).subscribe(() => {
      if (this.room.scrolling) {
        this.scrollToNextUser();
      }
    });
  }

  scrollToNextUser(): void {
    this.currentScrollingUserIndex = (this.currentScrollingUserIndex + 1) % this.room.users.length;
  }

  updateCountdown(timer:number): void {
    console.log(this.totalNoOfRoundGame,'this.totalNoOfRoundGame');
    
    const now = new Date().getTime();
    const distance = this.room.lotteryDate.getTime() - now;
    console.log(distance, 'distance check');
    

    if (distance < 0) {
      if (this.room.currentRound < this.totalNoOfRoundGame) {
        this.room.currentRound += 1;
        if (this.room.currentRound <= this.totalNoOfRoundGame) {
          this.room.lotteryDate = new Date(new Date().getTime() + timer);
          // this.room.lotteryDate = new Date(new Date().getTime() + this.roundDuration);
          this.room.scrolling = true;
        }
      }
      this.room.timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      this.room.timeRemaining = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
      console.log(this.room.timeRemaining);
      
      // this.room.timeRemaining = {
      //   days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      //   hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      //   minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      //   seconds: Math.floor((distance % (1000 * 60)) / 1000)
      // };
    }
  }

  selectWinnerForRound(): void {
    let winner: User;
    if (this.winners && this.winners.length > this.room.currentRound) {
      winner = this.winners[this.room.currentRound];
    } else {
      winner = this.selectAutomaticWinner();
    }

    if (winner) {
      this.room.winners.push(winner);
      this.room.scrolling = false;
    }
  }

  selectAutomaticWinner(): User {
    const remainingUsers = this.room.users.filter(user => !this.room.winners.includes(user));
    if (remainingUsers.length === 0) {
      console.error('No remaining users to select from.');
      return this.room.users[0];
    }
    const randomIndex = Math.floor(Math.random() * remainingUsers.length);
    console.log(remainingUsers, 'remainingUsers');
    return remainingUsers[randomIndex];
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this._countdownSubscription) {
      this._countdownSubscription.unsubscribe();
    }
  }


  ifAutoWinnerSelectedThenRemoveFromList(){
    this.room.winners.forEach((itemB: any) => {
      const index = this.room.users.findIndex((itemA: any) => Number(itemA.user_id) === Number(itemB.user_id));
      if (index !== -1) {
        this.room.users.splice(index, 1);
      }
    });
  }

  getPreviousUserIndex(index: number): number {
    return (index - 1 + this.room.users.length) % this.room.users.length;
  }

  getNextUserIndex(index: number): number {
    return (index + 1) % this.room.users.length;
  }
}