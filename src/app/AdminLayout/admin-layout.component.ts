import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../Services/Auth.service';
import { GetUserModel } from '../Models/InterfacesModels';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayout implements OnInit {
  opened = true;
  activeThemeName: string = 'lightTheme';
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  sideMenuListObj: any = []
  sidebarLogo: string = "assets/images/win-gift.png";
  isMiniSidebar: boolean = false;
  selectedOption: string = '';
  selectedProject: string = '';
  isSideMenu: boolean = true;
  isNotificationOpened: boolean = false;
  projectId: string = "";
  userData: any;
  public getScreenHeight: number = 0;
  // menuDataList: any=[];
  ActiveTitleCard: string = "Verify Form"
  contractorName: string = "test"
  isCollepsed: boolean = false;
  authData: GetUserModel = {
    userName: '',
    phone: '',
    email: '',
    address: undefined,
    token: "",
    userRole: '',
    status: '',
    id: '',
    createdAt:new Date(),
    updatedAt:new Date(),
  };
  // authData: GetUserModel = (enquiryList as any).default.authData;

  constructor(private authService: AuthService, private router: Router) {
    this.authData = this.authService.getAuthData();
    this.sideMenuListObj = [
      {
        id: 1,
        displayName: 'Dashboard',
        link: '/admin/dashboard',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },
      {
        id: 2,
        displayName: 'Room',
        link: '/admin/room-list',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },
      {
        id: 3,
        displayName: 'User List',
        link: '/admin/user-list',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },
      {
        id: 4,
        displayName: 'Terms And Conditions',
        link: '/admin/term-cond',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },
      {
        id: 5,
        displayName: 'Privacy Policy',
        link: '/admin/privacy-policy',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },

      {
        id: 5,
        displayName: 'Winners Data',
        link: '/admin/winnersdata',
        iconType: 'png',
        icon: 'dot',
        visibility: true
      },

      // {
      //   id: 3,
      //   displayName: 'Winner List Calculation',
      //   link: '/admin/winnerper',
      //   iconType: 'png',
      //   icon: 'dot',
      //   visibility: true
      // },
    
    ]
  }

  ngOnInit() {
    // this.menuDataList = this.sideMenuListObj;
    this.getScreenHeight = window.innerHeight - 2;
    this.selectedOption = this.router.url.split('/')[1];
    this.selectedProject = this.router.url.split('/')[2];
    let that = this;
    this.authService.todos$.subscribe((res: any) => {
      if (res && res?.projectId) {
        // this.projectId = res.projectId;
        if (that.authData && that.authData?.userRole == 'SuperAdmin') {

        }
      }
    })

    if (localStorage.getItem(this.authService.STORAGE_KEY)) {
      this.userData = JSON.parse(this.authService.decryption(localStorage.getItem(this.authService.STORAGE_KEY)))
    }

    if (window.innerWidth < 768) {
      this.sidenav['fixedTopGap'] = 55;
      this.opened = false;
    } else {
      this.sidenav['fixedTopGap'] = 55;
      this.opened = true;
    }

    if (window.innerWidth <= 992 && window.innerWidth >= 425) {
      this.sidenav['fixedTopGap'] = 55;
      this.opened = false;
    }
  }

  toggleSidebar() {
    this.isCollepsed = !this.isCollepsed;
    this.sidenav.toggle();
  }

  onChangeRoutes(v: any) {
    if (this.opened == true && !v?.onLoad) {
      if (window.innerWidth <= 425) {
        this.sidenav.toggle();
      }
    } else if (v?.onLoad) {
      // this.isCollepsed = !this.isCollepsed;
    }

  }

  selectOption(value: string) {
  }


  /**@OnSearchButton */
  onSearchButton() {
    this.authService.navigateTo(`search-project`);
  }

  /**@TOOGGLE_NOTIFICATION */
  toggleNotification() {
    this.isNotificationOpened = !this.isNotificationOpened;
  }

  logout() {
    this.router.navigateByUrl("/login");
    localStorage.clear();
    sessionStorage.clear();
  }

  onSizeChange(event: any) {
    this.getScreenHeight = (event.target.innerHight - 2);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isCollepsed = false;
    if (event.target.innerWidth <= 992 && event.target.innerWidth >= 425) {
      this.sidenav['fixedTopGap'] = 55;
      this.opened = false;
    } else if (event.target.innerWidth < 769) {
      this.sidenav['fixedTopGap'] = 55;
      this.opened = false;
    } else {
      this.sidenav['fixedTopGap'] = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

  //**Active Ttile Card */
  ActiveTtile(title: string) {
    this.ActiveTitleCard = title
  }

  closePopup() {
    // this.dialog
  }


}