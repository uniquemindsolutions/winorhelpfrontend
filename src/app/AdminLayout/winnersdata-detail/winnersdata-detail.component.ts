import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminService } from '../../Services/Admin.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-winnersdata-detail',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule,
    MatTableModule, MatButtonModule, MatDialogModule, RouterModule, MatCardModule,FormsModule,
  ],
  providers:[AdminService],
  templateUrl: './winnersdata-detail.component.html',
  styleUrl: './winnersdata-detail.component.css'
})
export class WinnersdataDetailComponent {
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
