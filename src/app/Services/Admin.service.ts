import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      }

    createRoom(data:any) {
        return this.http.post(`${this.baseUrl}/admin/create_room`, data,{ headers: this.getAuthHeaders() });
    }

    roomList(page:number, limit:number) {
        return this.http.get(`${this.baseUrl}/admin/roomList?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
    }
    adminroomList(page:number, limit:number) {
        return this.http.get(`${this.baseUrl}/admin/adminroomList?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
    }

    usersList(page:number, limit:number) {
        console.log("baseurlchecking",this.baseUrl);
        return this.http.get(`${this.baseUrl}/admin/users?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
    }

    updateStatus(id:number, isActive:number) {
        return this.http.post(`${this.baseUrl}/admin/updateStatus/${id}`,{isActive},{ headers: this.getAuthHeaders() });
    }

    roomAllocation(data:any) {
        return this.http.post(`${this.baseUrl}/admin/roomAllocation`,data,{ headers: this.getAuthHeaders() });
    }

    debitRequest(data:any) {
        return this.http.post(`${this.baseUrl}/admin/debitRequest`,data,{ headers: this.getAuthHeaders() });
    }

    creditRequest(data:any) {
        return this.http.post(`${this.baseUrl}/admin/creditRequest`,data,{ headers: this.getAuthHeaders() });
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
        return this.http.post(`${this.baseUrl}/admin/updateterms`, data,{ headers: this.getAuthHeaders() });
    }

    getTerms() {
        return this.http.get(`${this.baseUrl}/admin/getTerms`,{ headers: this.getAuthHeaders() });
    }

    updatePrivacy(data:any) {
        return this.http.post(`${this.baseUrl}/admin/updateprivacy`, data,{ headers: this.getAuthHeaders() });
    }

    getPrivacy() {
        return this.http.get(`${this.baseUrl}/admin/getprivacy`,{ headers: this.getAuthHeaders() });
    }

    getroomUserList(data:any) {
        return this.http.get(`${this.baseUrl}/admin/getroomUserlist`,{ headers: this.getAuthHeaders() });
    }

   

    getRoomDetail(data:any) {
        return this.http.post(`${this.baseUrl}/admin/getRoomDetails`, data,{ headers: this.getAuthHeaders() });
    }

    saveWinners(data:any) {
        return this.http.post(`${this.baseUrl}/admin/winnerSave`, data,{ headers: this.getAuthHeaders() });
    }

    getRoomUsersList(roomId:any) {
        return this.http.post(`${this.baseUrl}/admin/getRoomUsersList`, {roomId},{ headers: this.getAuthHeaders() });
    }
    
    winnerpecr(page:number, limit:number) {
        return this.http.get(`${this.baseUrl}/admin/roomWinnerList?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
    }

    roomwinerperUpdate(data:any) {
        return this.http.post(`${this.baseUrl}/admin/roomwinerperUpdate`,data,{ headers: this.getAuthHeaders() });
    }

    getmasterdata() {
        return this.http.get(`${this.baseUrl}/admin/masterdata`,{ headers: this.getAuthHeaders() });
    }

    masterdataUpdate(data:any) {
        return this.http.post(`${this.baseUrl}/admin/masterdataupdate`,data,{ headers: this.getAuthHeaders() });
    }

    getUserMasterDetails(data:any) {
        return this.http.post(`${this.baseUrl}/admin/getUserMasterDetails`, data,{ headers: this.getAuthHeaders() });
    }

    submitWinners(data:any) {
        return this.http.post(`${this.baseUrl}/admin/submitWinners`, data,{ headers: this.getAuthHeaders() });
    }
    getsubmitWinners(data:any) {
        return this.http.post(`${this.baseUrl}/admin/getsubmitWinners`, data,{ headers: this.getAuthHeaders() });
    }


    roommasterdataupdate(data:any) {
        return this.http.post(`${this.baseUrl}/admin/roommasterdataupdate`,data,{ headers: this.getAuthHeaders() });
    }

    roomListWinners(page:number, limit:number) {
        return this.http.get(`${this.baseUrl}/admin/roomListWinners?page=${page}&limit=${limit}`,{ headers: this.getAuthHeaders() });
    }

    deleteRoom(id:number) {
        return this.http.post(`${this.baseUrl}/admin/deleteroom`,{id},{ headers: this.getAuthHeaders() });
    }

    getallTransList() {
        const userid=localStorage.getItem('user_id');
        return this.http.get(`${this.baseUrl}/admin/userhist`,{ headers: this.getAuthHeaders() });
    }
   

}