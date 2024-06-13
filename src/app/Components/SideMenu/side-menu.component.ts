import { Component, OnInit, EventEmitter, Input, Output, isDevMode } from '@angular/core';
// import { sideMenuListObj } from './../../Layouts/app-layout.constants';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import {AuthService} from './../../Services/Auth.service'
import MuiDialogService from '../../Services/MuiDialog.service'
import { environment } from './../../../environments/environment';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent implements OnInit {
  @Output() onChangeRoutes = new EventEmitter<any>();
  @Input() sideMenuListObj:any=[];
  isSuperAdminProjectSelected:boolean=false;
  showSubmenu:number=-1;
  
  constructor(private router: Router, private toastService:MuiDialogService, private service:AuthService) {
    if(sessionStorage.getItem(`${environment.STORAGE_KEY}/showSubmenu`)){
      this.showSubmenu =Number(sessionStorage.getItem(`${environment.STORAGE_KEY}/showSubmenu`));
    }
    
    this.service.currentMessage.subscribe((value:any)=>{
      if(value?.type=='REFRESH_SIDEMENU'){
        (async()=>{
          const res=await this.service.delay(200);
          if(res){this.ngOnInit();}
        })();
      }
    })
  }

  get isInspectElementOpened(){
    if((window.screen.height - window.innerHeight) > 160){
      return true;
    }else{
     return false;
    }
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   for (let i = 0; i < this.sideMenuListObj.length; i++) {
    //     if(this.router.url==this.sideMenuListObj[i].link){
    //       this.onChangeRoutes.emit({...this.sideMenuListObj[i], onLoad:(window.innerWidth>1200 ? true: false)});
    //     }

    //     // this.sideMenuListObj[i].visibility=true;
    //   }
    // }, 300);

    // this.handleChangeRoutes('fresh');
    // this.routerEventsSubscription = this.router.events.subscribe((event:any) => {
    //   if(event instanceof NavigationEnd) {
    //     this.handleChangeRoutes(event);
    //   }
    // });
  }


  handleChangeRoutes(event:any){
    // ;;;
  }
 
  onChange(v:any, i:number){
    this.showSubmenu=i;
    sessionStorage.setItem(`${environment.STORAGE_KEY}/showSubmenu`, `${i}`);
    this.onChangeRoutes.emit(v);
    if(this.router.url==v?.link){
      // this.service.refresh();
    }
  }


  ngOnDestroy() {
    // Unsubscribe from router events to avoid memory leaks
    // if (this.routerEventsSubscription) {
    //   this.routerEventsSubscription.unsubscribe();
    // }
  }

  logout(){
    localStorage.removeItem(environment.STORAGE_KEY);
    sessionStorage.clear();
    localStorage.clear();
    this.service.navigateTo('/auth/login');
    this.toastService.openSnackBar('You have been successfully signed out', 'Success');
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