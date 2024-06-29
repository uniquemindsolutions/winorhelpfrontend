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
//   public isFixed = false;
//   @HostListener('window:scroll', [])
//  onWindowScroll() {
//     const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
//     this.isFixed = offset > 100; 
//   }

userDetails: any;

constructor(private admin: AdminService) { 
  
}



loginheader:boolean=true;
  ngOnInit() {
    const data = {"user_id": localStorage.getItem('user_id')}
    this.admin.getUserMasterDetails(data).subscribe({
      next: (res: any) => {

      this.userDetails = res.data;
      console.log(res.data, "res test")
      }, error: (err: any) => {
        //this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
      }

  }) 
}



}
