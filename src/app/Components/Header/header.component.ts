import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule,RouterLink, NgbModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public isCollapsed = true;
//   public isFixed = false;
//   @HostListener('window:scroll', [])
//  onWindowScroll() {
//     const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
//     this.isFixed = offset > 100; 
//   }

constructor() { 
  
}

loginheader:boolean=true;
  ngOnInit() {
    // //alert(localStorage.getItem('loginsession'));
    // if(localStorage.getItem('loginsession')=="true"){
    //  this.loginheader=false;
    // }
}

}
