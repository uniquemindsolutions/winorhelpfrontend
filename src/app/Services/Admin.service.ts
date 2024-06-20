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

@Injectable()
export class AdminService {
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

    createRoom(data:any) {
        return this.http.post(`${this.baseUrl}/admin/create_room`, data);
    }

    roomList(page:number, limit:number) {
        return this.http.get(`${this.baseUrl}/admin/roomList?page=${page}&limit=${limit}`);
    }

    usersList(page:number, limit:number) {
        console.log("baseurlchecking",this.baseUrl);
        return this.http.get(`${this.baseUrl}/admin/users?page=${page}&limit=${limit}`);
    }

    updateStatus(id:number, isActive:number) {
        return this.http.post(`${this.baseUrl}/admin/updateStatus/${id}`,{isActive});
    }

    roomAllocation(data:any) {
        return this.http.post(`${this.baseUrl}/admin/roomAllocation`,data);
    }

    debitRequest(data:any) {
        return this.http.post(`${this.baseUrl}/admin/debitRequest`,data);
    }

    creditRequest(data:any) {
        return this.http.post(`${this.baseUrl}/admin/creditRequest`,data);
    }

    
    /**
     * Marks all controls in a form group as touched
     * @param formGroup - The form group to touch
    */
    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Marks all controls in a form group as unTouched, reset & remove error
     * @param formGroup - The form group to touch
     */
    markUnTouchedAndReset(formGroup: FormGroup) {
        formGroup.reset();
        formGroup.markAsPristine({ onlySelf: true });
        formGroup.markAsUntouched({ onlySelf: true });
        (<any>Object).keys(formGroup.controls).map((field:any) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) { control.setErrors(null); }
        });
    }

    get getBreakPoints() {
        return this.bPoint.observe(Breakpoints.XSmall);
    }

    updateTerms(data:any) {
        return this.http.post(`${this.baseUrl}/admin/updateterms`, data);
    }

    getTerms() {
        return this.http.get(`${this.baseUrl}/admin/getTerms`);
    }

    updatePrivacy(data:any) {
        return this.http.post(`${this.baseUrl}/admin/updateprivacy`, data);
    }

    getPrivacy() {
        return this.http.get(`${this.baseUrl}/admin/getprivacy`);
    }

    getroomUserList(data:any) {
        return this.http.post(`${this.baseUrl}/admin/getroomUserlist`,data);
    }

   

    getRoomDetail(data:any) {
        return this.http.post(`${this.baseUrl}/admin/getRoomDetails`, data);
    }

   

}