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

constructor(private admin: AdminService,private service:AuthService,private router:Router,private authService: AuthService,) { 
  
}



loginheader:boolean=true;
  ngOnInit() {
    const userid=localStorage.getItem('user_id');
    if(userid==null || userid==''){
      this.visiblelable=false;
        // window.location.reload();
        // this.router.navigate(['/home']);
    }else{
      this.visiblelable=true;
    }
    
    const data = {"user_id": localStorage.getItem('user_id')}
    this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      this.userDetails = res.data;
      localStorage.setItem("walletamount",res.data.wallet_amount);
      console.log(res.data, "restest");
      }, error: (err: any) => {
       
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('user_id');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
      }

  }) 
}

logout() {
        this.authService.logout();
       
        this.router.navigate(['/home']);
}


}
