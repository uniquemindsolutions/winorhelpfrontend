import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../Services/Admin.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule,RouterLink, NgbModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[AdminService]
})
export class HeaderComponent {
  public isCollapsed = true;
  visiblelable:boolean=false;

userDetails: any;

constructor(private admin: AdminService) { 
  
}



loginheader:boolean=true;
  ngOnInit() {
    const userid=localStorage.getItem('user_id');
    if(userid!=''){
     this.visiblelable=true;
    }
    const data = {"user_id": localStorage.getItem('user_id')}
    this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      this.userDetails = res.data;
      localStorage.setItem("walletamount",res.data.wallet_amount);
      console.log(res.data, "res test")
      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
}



}
