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
import { environment } from '../../../environments/environment';
import { ConfirmationComponent } from '../../Components/Confirmation/confirmation.component';
import { interval } from 'rxjs';
import { AuthService } from '../../Services/Auth.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatSlideToggleModule, CommonModule],
  providers: [
    AdminService // Register the service hereng 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  displayedColumns: string[] = ['sno', 'roomId', 'date', 'entryFee', 'totalParticipants', 'winningAmount', 'action', 'viewDetails'];
  dataSource: any;
  dataSourcenew:any=[];
  currentPage: number = 1;
  perPage: number = 0;
  walletAmount: any = 100;
  roomlistdata:any=[];
  timeRemaining:any;
  visiblelable:boolean=false;
  visiblelableclick:boolean=false;
  sessionuser:boolean=false;
  constructor(public dialog: MatDialog, private muiService: MuiDialogService, private api: AdminService,
    private formBuilder: FormBuilder,
    private customeservice: CustomeServiceService,
    private router: Router,
  ) {

   
  }

  ngOnInit() {
  
    const userid=localStorage.getItem('user_id');
  // alert(userid)
    if(userid!='' && userid!=null){
      this.sessionuser=true;
     this.visiblelable=true;
    }

    if (localStorage.getItem('user_id') == '') {
      //window.location.reload();
      this.router.navigate(['/home']);
    }
    this.getRoomList();
    this.customeservice.getCurrentWalletAmount().subscribe({
      next: (res: any) => {
        console.log(res.data, 'currentAmount');
        this.walletAmount = res.data[0].wallet_amount
      },
      error: (err: any) => {

      }
    })
    this.masterdata();

    interval(5000).subscribe(() => {
      this.getRoomList();
    });


   }
   masterdata(){
    this.api.getmasterdata().subscribe({
      next:(res:any) => {
        localStorage.setItem("refper",res.data[0].ref_per);
        console.log(localStorage.getItem('refper'), 'getmasterdata');
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
          for (let i = 0; i < this.dataSource.length; i++) {
          

     const now = new Date().getTime();
    const end = new Date(this.dataSource[i].endDate+' '+this.dataSource[i].endTime).getTime();
    const start = new Date(this.dataSource[i].startDate+' '+this.dataSource[i].startTime).getTime();
    const distance = end - now;


   

    console.log('Iteration:', this.dataSource[i]);
    if (distance <= 0) {
      this.timeRemaining = {};
      // this.timerEnded = true;
      // this.subscription.unsubscribe();
      //this.visiblelable=false;
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      //this.timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      this.timeRemaining={"days":days,"hours":hours,"minutes":minutes,"seconds":seconds}
    }

            this.dataSource[i]['timerdata'] = this.timeRemaining;

            console.log('Iteration:', this.dataSource[i]);

                const now_valid = new Date().getTime();
                const newEndTime = this.addMinutesToTime(this.dataSource[i].latter_datetime, 12);
               // const end_valid = new Date(this.dataSource[i].endDate+' '+this.dataSource[i].endTime).getTime();
                //const newEndTime = this.addMinutesToTime(this.dataSource[i].endDate+' '+this.dataSource[i].endTime, 12);
                const end_valid = new Date(newEndTime).getTime();
                const start_valid = new Date(this.dataSource[i].startDate+' '+this.dataSource[i].startTime).getTime();
                //console.log(end_valid,now_valid,"timechecking")
                const distance_valid = end_valid - now_valid;

                const rangecheck=this.isWithinRange(start_valid,end_valid,new Date());
                console.log("rangecheck",rangecheck);

                if(rangecheck===true){
                  this.dataSource[i]['visibility'] = true;
                }else{
                  this.dataSource[i]['visibility'] = false;
                }


                const end_validclick = new Date(this.dataSource[i].endDate+' '+this.dataSource[i].endTime).getTime();
                const rangecheckend=this.isWithinRange(start_valid,end_validclick,new Date());

                if(rangecheckend===true){
                  this.visiblelableclick = true;
                }else{
                  this.visiblelableclick  = false;
                }
              

                // const today =new Date().toISOString().split('T')[0];
                
                // const endate = this.dataSource[i].endDate;

                const todaytime = new Date().getTime();
                //const endatetime = new Date(this.dataSource[i].endDate+' '+this.dataSource[i].endTime).getTime();
                //const endatetime = new Date(this.dataSource[i].latter_datetime).getTime();


                const newEndTime22 = this.addMinutesToTime(this.dataSource[i].latter_datetime, 10);
                const endatetime = new Date(newEndTime22).getTime();

                if (todaytime > endatetime) {
                 
                  this.dataSource[i]['showroom'] = false;
                  
                } else if (todaytime < endatetime) {
                 
                  this.dataSource[i]['showroom'] = true;
                } else {
                  
                  this.dataSource[i]['showroom'] = false;
                }
            
                

            this.api.getRoomUsersList(this.dataSource[i].roomId).subscribe({
              next: (res: any) => {
               
             console.log("resusers", res);
         
                this.dataSource[i]['winningtot'] = res.users.length*this.dataSource[i].entryFee;
                this.masterroomUpdate(this.dataSource[i].roomId,res.users.length*this.dataSource[i].entryFee,res.users.length)
               
              },
              error: (err: any) => {
        
              }
            })

            console.log(this.dataSource, 'dataSourcenew');
            
          }
        },
        error: (err: any) => {
  
        }
      })
    
      
  
    }

    calculateDaysDifference(date1: Date, date2: Date): number {
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
      const differenceInMilliseconds = utc1 - utc2;
      return Math.floor(differenceInMilliseconds / millisecondsPerDay);
    }

    roomalocate(roomid:any,roomamount:any){
     
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '350px', height:'200px', 
        data: { title: 'Confirm Action', message: 'Are you sure you want to do this?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          // Perform the action confirmed
          //console.log('User confirmed action');

          if(this.walletAmount>0){

            const refpercentage=localStorage.getItem('refper');
            const data={"roomnumber":roomid,"roomamount":roomamount,"refpercentage":refpercentage,"user_id":localStorage.getItem('user_id')};
            this.customeservice.roomuserlistInsert(data).subscribe({
              next: (result:any) => {
                console.log("resultvalroominsert",result);
                //this.router.navigate(['/mytransaction']);
                // alert("Added to room"+roomid);
                this.muiService.openSnackBar({ message:'Successfully added to room', title: 'Successfully Added'}, 'Success');
              },
              error: (err: any) => {
                this.muiService.openSnackBar({ message:'Already Entered into the room or not having suffient balance ', title: 'Room Registration Failed!'}, 'Error');
              }
            })
          }else{
            this.muiService.openSnackBar({ message:'not having suffient balance', title: 'Room Registration Failed!'}, 'Error');
          }


        } else {
          console.log('User cancelled action');
        }
      });

   
//       let text = "OK or Cancel";
//   if (confirm(text) == true) {
   
//   } else {
//     // text = "You canceled!";
//   }
// }

  // getRoomList() {
  //   this.api.roomList(this.currentPage, this.perPage).subscribe({
  //     next: (res: any) => {
  //       console.log(res.data, 'Roomlist');
  //       this.dataSource = res.data;
  //     },
  //     error: (err: any) => {

  //     }
  //   })
  // }
    }

  viewDetails(item: any) {
    sessionStorage.setItem(`${environment.STORAGE_KEY}/roomDetail`, btoa(JSON.stringify(item)));
    //this.router.navigate(['/latterygame'], { queryParams: { id: item.roomId } });
    this.router.navigate(['/timergame'], { queryParams: { id: item.roomId } });
  }
  masterroomUpdate(roomId:any,winningAmount:any,totusers:any){

    const payload={"roomId":roomId,"winningAmount":winningAmount,"totalParticipants":totusers}
    this.api.roommasterdataupdate(payload).subscribe({
      next: (res: any) => {
      },
      error: (err: any) => {

      }
    })
      
  }

  isWithinRange(fromdate:any,todate:any,givendate:any): boolean {
    const currentTime = givendate.getTime();
     console.log("dates",fromdate,'---',todate,'---',givendate);
    return currentTime >= fromdate && currentTime <= todate;
  }

  addMinutesToTime(time: string | Date, minutes: number): string {
    const date = new Date(time); // Create a new Date object from the given time
    date.setMinutes(date.getMinutes() + minutes); // Add the specified minutes
    return date.toISOString(); // Return the new time as an ISO string
  }
 

}
