import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { AdminService } from '../../Services/Admin.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-listofwindetails',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule,
    MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,FormsModule,
  ],
  providers:[AdminService],
  templateUrl: './listofwindetails.component.html',
  styleUrl: './listofwindetails.component.css'
})
export class ListofwindetailsComponent {
  winnerlistfinalresult:any;
  paramValue:any;
  public roomInfo: any = JSON.parse(atob(sessionStorage.getItem(`${environment.STORAGE_KEY}/roomDetail`) || '') || '{}');
  constructor(private api:AdminService,private changeDetectorRef: ChangeDetectorRef,private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    

    this.route.queryParams.subscribe(params => {
      this.paramValue = params['id']; // Replace 'yourParamName' with your query param name
      console.log(this.paramValue);
    });
    // alert(this.paramValue);
    this.getwinnersdata();
  }

  getwinnersdata(){

    
    const getpayload={"room_id":this.paramValue}


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

}
