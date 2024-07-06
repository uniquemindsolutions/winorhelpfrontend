import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Room, User } from '../room.model';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../Services/Admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-timergame',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule,
    MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,FormsModule,
  ],
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
  percentagearray:any;
  winningamount:any;
  winnerlistfinal:any=[];
  gameview:boolean=false;
  gameviewWinners:boolean=false;
  winnerlistfinalresult:any;
  intervalId: any;
  filtermanuvallist:any=[];
  
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
 
    
    // console.log("roomsInfointial",this.roomsInfo);
    // console.log("userwinning",this.users);        
    this.getwinnersdata();

    this.checkingEntitlements();

    // this.intervalId = setInterval(() => {
    //   if(this.gameview===true){
    //     clearInterval(this.intervalId);
    //   }else{
    //     this.checkingEntitlements();
    //   }
    // }, 10000);
   
  
  }

  checkingEntitlements(){
    setTimeout(() => {
      console.log("winnerlistfinalresult",this.winnerlistfinalresult);  
      if(this.winnerlistfinalresult?.length>0){
        //alert("Hii");
        this.gameview=false;
        this.gameviewWinners=true;
      }else{
       // alert("byee");
        this.getRoomUsersList();
      }
      },2000)
  }

  splitStringToArray(input: string): string[] {
    return input.split(',');
  }

  getRoomUsersList() {
    this.isLoading = true;
    let that = this;
    this.api.getRoomUsersList(this.roomInfo.roomId).subscribe({
      next: (res: any) => {
        const jsonstringfy=res.roomsInfo.winingPercentageInfo;
        console.log("roomdetails",res);
       
        this.isLoading = false;
        if (res && res.status && res.users.length) {
          that.isLoading = false;
          this.users = res.users;
          this.winningamount=this.users.length*res.roomsInfo.entryFee;
          this.roomsInfo = res.roomsInfo;
          console.log("roomsInfo",this.roomsInfo);
          this.percentagearray=JSON.parse(res.roomsInfo.winingPercentageInfo);
          console.log(this.percentagearray[0],"percentagearray");
          this.winners = [];
          if(this.roomsInfo['manuval_winners']){
            let win:any[]=this.roomsInfo['manuval_winners'];
            let arrwin=this.roomsInfo['manuval_winners'].split(',')
           
            console.log("manuvalist",arrwin);
            for (let i = 0; i < arrwin.length; i++) {
             const filterdata =this.findUserById(arrwin[i]);
              
              this.filtermanuvallist.push(filterdata);
              console.log("manuvalist",filterdata);
              this.winners.push({
                user_id:arrwin[i],
                username:''
              })
            }
          

          }
          console.log("manuvalist",this.filtermanuvallist); 
          this.totalNoOfRoundGame=0;
          if(this.roomsInfo && this.roomsInfo['winingPercentageInfo']){
              let temp:any=JSON.parse(this.roomsInfo['winingPercentageInfo']);
              this.totalNoOfRoundGame=temp.length;
          }

          this.addUsernameAndRemoveMatchingItems();
         
          
            const now = new Date().getTime();
            const end = new Date(this.roomsInfo.latter_datetime).getTime();
            const distance = end - now;
            console.log("roomsInfo",distance);
            if(distance<=0){
              this.gameview=true;
              this.startCountdown();
              this.startScrolling();
            }
         
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
        // this.users.splice(index, 1);
      }
    });
    this.room.users=this.users;
    this.changeDetectorRef.detectChanges();
    console.log("displayusers", this.room.users)
  }

  startCountdown(): void {
    // this.updateCountdown();
   

    let timer=this.users.length * 3000;
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
          console.log("enduser","test");
          setTimeout(() => {
          this.submitWinners(this.winnerlistfinal);
          this.gameview=false;
          this.gameviewWinners=true;
          },6000);

          setTimeout(() => {
            this.getwinnersdata();
            },7000)


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
    console.log("usersdata",this.users);
    console.log("usersdata",this.filtermanuvallist);
   this.room.manualWinners=this.filtermanuvallist;
    let winner: User;
    if (this.room.manualWinners && this.room.manualWinners.length >= this.room.currentRound) {
      //console.log("checkingmanuvalwinners",this.room.manualWinners);
      winner = this.room.manualWinners[this.room.currentRound-1];
      console.log("winnersdatadddd",winner);
    } else {
     // console.log("checkingmanuvalwinners",this.room.manualWinners);
      winner = this.selectAutomaticWinner();
    }
    console.log("this.winnerlistfinal",winner)
    if (winner) {
      
      this.room.winners.push(winner);
      this.room.scrolling = false;
      this.winnerlistfinal=this.room.winners;
    
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

  submitWinners(winnersdata:any){
   
    

    winnersdata.forEach((item:any, index:any) => {
     //console.log("winnersfinaldata",item);
     const amounttobepaid=((this.winningamount * this.percentagearray[index].winAmountPer) / 100)-(((this.winningamount *
      this.percentagearray[index].winAmountPer) / 100)*this.percentagearray[index].deductAmountPer/100);
      const payload={
        "room_id":item.room_id,
        "user_id":item.user_id,
        "username":item.username,
        "winner_orderid":index+1,
        "tot_amount_send":amounttobepaid
      }
      // console.log("winnersfinaldata",payload);


      this.api.submitWinners(payload).subscribe({
      });



    });
   // this.getwinnersdata();
    
  }

  getwinnersdata(){

    
    const getpayload={"room_id":this.roomInfo.roomId}


    this.api.getsubmitWinners(getpayload).subscribe({
      next: (res: any) => {
    console.log("winnersfinaldata",res);
    
    this.winnerlistfinalresult=res.data;
    console.log("winnerlistfinalresult",this.winnerlistfinalresult);  
      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
    
  }


  findUserById(id: any) {
    console.log("Userdetails",id);
    const user = this.users.find((user: any) => user.user_id === id);
    
    //this.filtermanuvallist.push(user)
    return user;
    //console.log("Userdetails22",user);
  }
}