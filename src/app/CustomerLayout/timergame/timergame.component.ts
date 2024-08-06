import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { from, interval, Subscription } from 'rxjs';
import { Room, User } from '../room.model';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../Services/Admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CustomeServiceService } from '../../Services/custome-service.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-timergame',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule,
    MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,FormsModule,
    MatFormFieldModule, MatInputModule,
    MatSnackBarModule
  ],
  providers:[AdminService],
  templateUrl: './timergame.component.html',
  styleUrl: './timergame.component.css'
})
export class TimergameComponent {
  private countdownSubscription: Subscription | undefined;
  private scrollSubscription: Subscription | undefined;
  private _countdownSubscription: Subscription | undefined;
  public roundDuration = 60000; // 1 minute per round
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
  testarray:any=[];


  winnerlistfinalresultarray: any[] = [];
  activeround:any=0;
  scrollstop:boolean=false;
  lattersetdate:any="";

  restartgame:string="start";

  
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

  constructor(private api:AdminService,private changeDetectorRef: ChangeDetectorRef,private customeservice:CustomeServiceService,
    private cdr: ChangeDetectorRef,private snackBar: MatSnackBar
  ) {
    console.log(new Date(new Date(this.roomInfo.latter_datetime).getTime() + this.roundDuration), 'popat');

  }
  

ngOnInit(): void {

  
  this.checkRoomUsersList();

  interval(1000).subscribe(() => {

    const now = new Date();
  const targetDate = new Date(this.lattersetdate);
  if(this.lattersetdate!=''){
    if (this.areDatesEqual(now, targetDate)) {
      // alert("hii");
      window.location.reload();
    }
  }
      


    // if(this.restartgame!="end"){
    //   this.checkRoomUsersList();
    // }else{
    // }
   
    this.getwinnersdata();
  
    console.log(this.winnerlistfinalresult?.length,"lenght",this.totalNoOfRoundGame,this.restartgame);
    if(this.winnerlistfinalresult?.length===undefined){
    
      console.log("restartstatus",this.restartgame);
      
      setTimeout(() => {

        if(this.winnerlistfinalresult?.length==this.totalNoOfRoundGame && this.winnerlistfinalresult?.length!='0'){
          this.gameview=false;
          this.scrollstop=false;
          this.gameviewWinners=true;
          
         
        }else if(this.winnerlistfinalresult?.length>0){
          this.scrollstop=true;
          this.gameviewWinners=true;
          this.gameview=true;
          this.startScrolling();
          

        }else{
         // alert("Start")
         
          this.gameview=true;
          this.gameviewWinners=false;
          this.getRoomUsersList();
        
        }
        
      }, 1000);

      
    }
    
  });
 
          
   
  
  }


   areDatesEqual(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2?.getFullYear() &&
      date1.getMonth() === date2?.getMonth() &&
      date1.getDate() === date2?.getDate() &&
      date1.getHours() === date2?.getHours() &&
      date1.getMinutes() === date2?.getMinutes() &&
      date1.getSeconds() === date2?.getSeconds()
    );
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
            this.filtermanuvallist=[];
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

            console.log("restartcheck",distance,this.winnerlistfinal.length);
            if(distance<=0 && this.winnerlistfinal.length<=0){
             
              this.gameview=true;
              this.scrollstop=true;
              this.startCountdown();
              this.startScrolling();
              this.restartgame="end";
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
    this.updateCountdown(3000);
   

    let timer=this.users.length * 3000;
    console.log(timer, 'timer');
  
    console.log(new Date(), 'AA');

    let roundurationval=this.users.length * 2000;

    this._countdownSubscription = interval(roundurationval).subscribe(() => {
   console.log("winnnerlenght",this.room.winners.length,this.totalNoOfRoundGame);
    
   if(this.room.winners.length<=this.totalNoOfRoundGame){
   this.selectWinnerForRound();
   }

      if(this.room.winners.length==this.totalNoOfRoundGame){
         this.gameview=false;
         this.gameviewWinners=true;
       this.isRoundComplited=true;
        if (this._countdownSubscription) {
          this._countdownSubscription.unsubscribe(); // Properly unsubscribe from the interval
        }
      }
  

    
    })

    this.countdownSubscription = interval(10000).subscribe(() => {
      this.updateCountdown(timer);
      this.ifAutoWinnerSelectedThenRemoveFromList();
      if(this.room.winners.length==this.totalNoOfRoundGame){
        this.isRoundComplited=true;
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe(); // Properly unsubscribe from the interval
          console.log("enduser","test");


          


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
    console.log("nextuser",this.currentScrollingUserIndex);
  }

  updateCountdown(timer:number): void {
   
    console.log(this.totalNoOfRoundGame,'this.totalNoOfRoundGame');
    
    const now = new Date().getTime();
    const distance = now-this.room.lotteryDate.getTime();
    console.log(distance, 'distance check');
    

    if (distance < 0) {
      console.log("rounds",this.room.currentRound);
      
      if (this.room.currentRound < this.totalNoOfRoundGame) {
        //console.log();
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

    
   this.room.manualWinners=this.filtermanuvallist;
    let winner: User;
    if (this.room.manualWinners && this.room.manualWinners.length>0) {
      
      winner = this.room.manualWinners[this.activeround];
     
    } else {

      winner = this.selectAutomaticWinner();
      
    }
    console.log("this.winnerlistfinal",winner)
    if (winner) {
      
      this.room.winners.push(winner);
      //this.room.scrolling = false;
      this.winnerlistfinal=this.room.winners;
    

      //if(this.gameviewWinners!=true){
        this.submitWinners(winner,this.room);
      //}

      //this.submitWinners(winner,this.room);
      
      // this.gameview=true;
      // this.gameviewWinners=true;


    }

    this.activeround += 1;

    
    
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

  submitWinners(winnersdata:any,roomdetails:any){
   this.getwinnersdata();
  // this.winningamount=roomdetails.entryFee *  roomdetails.users.length;
   console.log(winnersdata,"winningamountchecking",this.winnerlistfinalresult?.length);

   const amounttobepaid=((this.winningamount * this.percentagearray[this.winnerlistfinalresult?.length].winAmountPer) / 100)-(((this.winningamount *
    this.percentagearray[this.winnerlistfinalresult?.length].winAmountPer) / 100)*this.percentagearray[this.winnerlistfinalresult?.length].deductAmountPer/100);
  
 
   let winnerpopup="User Id:"+winnersdata.user_id+"--winning-- Fundamount:"+amounttobepaid;
  
   this.snackBar.open(winnerpopup, '', {
    duration: 5000, // Show for 1 second,
    horizontalPosition: 'center', 
      verticalPosition: 'bottom'
  });
    
     
     
      const payload={
        "room_id":winnersdata.room_id,
        "user_id":winnersdata.user_id,
        "username":winnersdata.username,
        "winner_orderid":this.winnerlistfinalresult?.length,
        "tot_amount_send":amounttobepaid,
        "totround":this.totalNoOfRoundGame
      }
      // console.log("winnersfinaldata",payload);

     // this.creditamount(payload);
      this.api.submitWinners(payload).subscribe({
      });



    //});
   // this.getwinnersdata();

    
  }

  getwinnersdata(){


    const getpayload={"room_id":this.roomInfo.roomId}


    this.api.getsubmitWinners(getpayload).subscribe((res: any) => {
      console.log("getwinnersdata222",res);
      this.winnerlistfinalresult=res.data;
      this.winnerlistfinalresultarray=res.data;
      //this.gameview=false;
      //this.gameviewWinners=true;
      
  }) 
  if(this.winnerlistfinalresult?.length==this.totalNoOfRoundGame){
    this.scrollstop=false;
  }

  // if(sessionStorage.getItem('lattertime')!=''){

  //   const now = new Date().getTime();
  // const end = new Date(sessionStorage.getItem('lattertime') as string).getTime();
  // const distance = end - now;
  
  // console.log("checkroomsInfo",distance);
  // if(now!=end){
  
  //   // this.restartgame="begin";
   
  // }else{
  //   window.location.reload();
  // }

  // }
  

  this.cdr.detectChanges();
    
  }


  findUserById(id: any) {
    console.log("Userdetails",id);
    const user = this.users.find((user: any) => user.user_id === id);
    
    //this.filtermanuvallist.push(user)
    return user;
    //console.log("Userdetails22",user);
  }

  creditamount(payload:any){


    const data={"amount":payload.tot_amount_send,"upi":'',"user_id":localStorage.getItem('user_id')};
     console.log("payload",data)

     const objData={
      userId:localStorage.getItem('user_id'),
      amount:payload.tot_amount_send
    }
    this.api.creditRequest(objData);
  }

  checkRoomUsersList() {
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
            this.filtermanuvallist=[];
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
            sessionStorage.setItem('lattertime',this.roomsInfo.latter_datetime);
            this.lattersetdate=this.roomsInfo.latter_datetime;
            console.log("checkroomsInfo",distance);
            // if(distance<=0  && this.restartgame=="start"){
              
            //   this.restartgame="begin";
            // }
         
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    })
  }

}