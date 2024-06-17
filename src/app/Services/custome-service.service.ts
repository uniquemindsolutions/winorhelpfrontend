import { HttpClient } from '@angular/common/http';
import { Injectable ,afterNextRender} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { BehaviorSubject } from "rxjs";
import { FormControl, FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';


export interface SHAIRED_DATA {
    type: string;
    data: any;
}

@Injectable({
  providedIn: 'root', // This makes the service available application-wide.
})
export class CustomeServiceService {
    emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    public STORAGE_KEY = environment.STORAGE_KEY;
    public baseUrl = environment.baseUrl;
    private _todo = new BehaviorSubject<SHAIRED_DATA[]>([]);
    readonly todos$ = this._todo.asObservable();
    private todos: SHAIRED_DATA[] = [];
    private messageSource = new BehaviorSubject({});
    currentMessage: any = {};

    constructor(private http: HttpClient, private router: Router, private bPoint: BreakpointObserver, public location: Location) {
        this.currentMessage = this.messageSource.asObservable();

        afterNextRender(() => {
            this.getAuthData();
        });
    }


    /**@GET_TOKEN */
    async isAuthenticated() {
        const auth: any = await this.getAuthToken();
        if (auth) return true;
        return false;
    }

    /**@getAuthToken */
    getAuthToken(): any {
        const auth: any = this.getAuthData();
        if (auth && auth?.token) {
            return auth?.token;
        }
        return false;
    }


    /**@DECRYPTION_KEY */
    public decryption(ciphertext: any) {
        return CryptoJS.AES.decrypt(ciphertext, environment.SALT_SECRET).toString(CryptoJS.enc.Utf8);
    }

    /**@getAuthDATA */
    getAuthData() {
        let temp: any = localStorage.getItem(this.STORAGE_KEY);
        temp = (temp ? this.decryption(temp) : null);
        if (temp) {
            const auth: any = JSON.parse(temp);
            return auth;
        }
        return null;
    }

    async delay(time: number) {
        return new Promise(resolve => { setTimeout(() => { resolve(true) }, (time || 1000)); })
    }

    /**@BACK_NAVIGATION */
    public goBack() {
        this.location.back();
    }

    /**@NAVIGATE_TO */
    public navigateTo(routerUrl: string) {
        this.router.navigate([routerUrl])
    }

    /**@GET_CURRENT_RIUTE_NAME */
    public getCurrentRouteName() {
        return this.router.url;
    }

    getTransList() {
        return this.http.get(`${this.baseUrl}/Wallettoperation/users_getwallet?page=1&limit=50&user_id=45`);
    }
    debitWalletamount(data:any) {
      return this.http.post(`${this.baseUrl}/Wallettoperation/walletwithdraw`,data);
  }

  roomuserlistInsert(data:any) {
    return this.http.post(`${this.baseUrl}/Wallettoperation/roomuserlistInsert`,data);
}

getCurrentWalletAmount() {
    return this.http.get(`${this.baseUrl}/Wallettoperation/getCurrentAmount`);
}

    
    
    



   

}





