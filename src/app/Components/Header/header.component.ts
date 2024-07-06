import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../Services/Admin.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../Services/Auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule,RouterLink, NgbModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[AdminService,AuthService]
})
export class HeaderComponent {
  public isCollapsed = true;
  visiblelable:boolean=false;

userDetails: any;

constructor(private admin: AdminService,private service:AuthService,private router:Router) { 
  
}



loginheader:boolean=true;
  ngOnInit() {
    const userid=localStorage.getItem('user_id');
  
    
    if(userid==null || userid==''){
      this.visiblelable=false;
    }else{
      this.visiblelable=true;
    }
    
    const data = {"user_id": localStorage.getItem('user_id')}
    this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      this.userDetails = res.data;
      localStorage.setItem("walletamount",res.data.wallet_amount);
      console.log(res.data, "res test");
      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
}

logout() {
  localStorage.removeItem(environment.STORAGE_KEY);
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('logoutEvent', 'true');
  localStorage.removeItem('loginEvent');
  this.service.navigateTo('/auth/login');
 // this.service.navigateTo('/home');
  // this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
  //   this.router.navigate(['/home']);
  // });
}


}
