import { Component, Input, OnInit, Injectable } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common'
import { AuthService } from './../../Services/Auth.service';
import { environment } from './../../../environments/environment';
// import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @Input() titleName: string | undefined;
  @Input() headerType: string | undefined;
  @Input() contractorName: string | undefined;
  isbackNavigation: boolean = false;
  currentBackNavigationIndex: number = -1;
  @Output() onToggleSidebar = new EventEmitter<any>();
  // sideMenuListObj = JSON.parse(JSON.stringify(sideMenuListObj)) || []
  authData: any = {};
  userImg: string = "assets/images/win-gift.png"
  isSuperAdminProjectSelected: boolean = false;
  constructor(private router: Router, private service: AuthService, private location: Location) {
    this.authData = this.service.getAuthData();
    this.service.todos$.subscribe(async (value: any) => {
      const res = await this.service.delay(100);
      if (res) {
        let i = 0;
        for (const key in value) {
          const routeName = this.service.getCurrentRouteName();
          const el: any = value[key];
          if (key == routeName && el?.isBackNavigation == true) {
            this.currentBackNavigationIndex = i;
            this.isbackNavigation = true;
            if (el?.displayName) this.titleName = el?.displayName;
          }
          i++;
        }
      }
    });
  }

  ngOnInit(): void {

  }

  onToggle() {
    this.onToggleSidebar.emit({ action: 'Toggle' });
    const navBar: any = document.querySelector('.header-nav-bar') as HTMLElement;
    if (navBar) {
      let stle = window.getComputedStyle(navBar);
      if (stle['left'] == '255px') {
        // navBar.style.left=0;
      }
    }

  }

  async back() {
    this.location.back();
    this.currentBackNavigationIndex = -1;
    const res = await this.service.delay(200);
    if (res) this.getHeaderTitleName();
  }

  getHeaderTitleName() {
    // for (let i = 0; i < this.sideMenuListObj.length; i++) {
    //   if(this.router.url==this.sideMenuListObj[i].link){
    //     this.titleName=(this.sideMenuListObj[i].displayName);
    //     this.isbackNavigation=false;
    //   }
    // }
  }

  changePassword() {
    this.authData = this.service.getAuthData();
    if (this.authData) {
      
    }
  }

  logout() {
    localStorage.removeItem(environment.STORAGE_KEY);
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('logoutEvent', 'true');
    localStorage.removeItem('loginEvent');
    this.service.navigateTo('/auth/login');
  }

  /**@GET_PROJECT_INFO */
  get getProjectInfo() {
    if (localStorage.getItem(`${environment.STORAGE_KEY}/projectInfo`)) {

      return JSON.parse(this.service.decryption(localStorage.getItem(`${environment.STORAGE_KEY}/projectInfo`)));
    } else {
      return null;
    }
  }
}
