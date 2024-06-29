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
  constructor(public dialog: MatDialog, private muiService: MuiDialogService, private api: AdminService,
    private formBuilder: FormBuilder,
    private customeservice: CustomeServiceService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('user_id') == '') {
      this.router.navigate(['/auth/login']);
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

    interval(1000).subscribe(() => {
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
          
            // this.dataSource[i].push("testdata");
            // console.log('Iteration:', this.dataSource[i]);
           
            // const now = new Date().getTime();
            // console.log('Iteration:', new Date());
    // const distance = this.dataSource[i].latter_datetime.getTime() - now;


    // const specificDate = new Date('2024-07-05T23:01:00');
    // const currentDate = new Date();

    // const distance = this.calculateDaysDifference(specificDate, currentDate);
    // console.log('Iteration:', distance);

    //         const timerval = {
    //           days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    //           hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    //           minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    //           seconds: Math.floor((distance % (1000 * 60)) / 1000)
    //         };

     const now = new Date().getTime();
    // const distance = this.dataSource[i].latter_datetime.getTime() - now;

    //const now = new Date(this.dataSource[i].startDate+' '+this.dataSource[i].startTime).getTime();
    const end = new Date(this.dataSource[i].endDate+' '+this.dataSource[i].endTime).getTime();
    const distance = end - now;



    console.log('Iteration:', this.dataSource[i]);
    if (distance < 0) {
      this.timeRemaining = {};
      // this.timerEnded = true;
      // this.subscription.unsubscribe();
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
        width: '250px',
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
    this.router.navigate(['/timergame'], { queryParams: { id: item.roomId } });
  }

 

}
