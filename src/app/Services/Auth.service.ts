import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable ,afterNextRender} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable, map } from "rxjs";
import { FormControl, FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';


export interface SHAIRED_DATA {
    type: string;
    data: any;
}

@Injectable()
export class AuthService {
    emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    public STORAGE_KEY = environment.STORAGE_KEY;
    public baseUrl = environment.baseUrl;
    private _todo = new BehaviorSubject<SHAIRED_DATA[]>([]);
    readonly todos$ = this._todo.asObservable();
    private todos: SHAIRED_DATA[] = [];
    private messageSource = new BehaviorSubject({});
    currentMessage: any = {};

    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private router: Router, private bPoint: BreakpointObserver, public location: Location) {
        this.currentMessage = this.messageSource.asObservable();

        afterNextRender(() => {
            this.getAuthData();
        });


        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
       this.currentUser = this.currentUserSubject.asObservable();
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

    /**@ENCRYPTION_KEY */
    public encryption(ciphertext: any) {
        return CryptoJS.AES.encrypt(JSON.stringify(ciphertext), environment.SALT_SECRET).toString();
    }

    /**@DECRYPTION_KEY */
    public decryption(ciphertext: any) {
        return CryptoJS.AES.decrypt(ciphertext, environment.SALT_SECRET).toString(CryptoJS.enc.Utf8);
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

   
    /**@FORGOT_PASSWORD_WITH_ID_or_EMAIL */
    forgotPassword(body: any) {
        return this.http.post(`${this.baseUrl}/projectinfo-snagr/forgotPassword`, body);
    }

    /**@FORGOT_PASSWORD_WITH_ID_or_EMAIL */
    verifyOtp(body: any) {
        return this.http.post(`${this.baseUrl}/projectinfo-snagr/verifyOtpForgotPwd`, body);
    }

    register(user: any) {
        console.log("regivalues",user)
         return this.http.post(`${this.baseUrl}/auth/register`, user);
    }
    
    /**@SIGN_IN_USER */
    // login(credentials: any) {
    //     return this.http.post(`${this.baseUrl}/auth/login`, credentials);
    // }

    login(credentials:any) {
        //console.log("tockenchecking",credentials);
        return this.http.post<any>(`${this.baseUrl}/auth/login`,credentials)
          .pipe(map(user => {
           
            if (user && user.token) {
                console.log("tockenchecking",user);
              sessionStorage.setItem('currentUser', JSON.stringify(user));
              localStorage.setItem('user_id', user.data.uniq_id);
              localStorage.setItem('token',user.token);
              this.currentUserSubject.next(user);

              if(credentials.email=='admin@gmail.com'){
                this.router.navigate(['/admin']);
              }
             
            }
            return user;
          }));
      }

      

      public get currentUserValue(): any {
        return this.currentUserSubject.value;
      }

      logout() {
        return this.http.get<any>(`${this.baseUrl}/auth/logout`,{ headers: this.getAuthHeaders() }).subscribe( {
           

            next: (res: any) => {
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('user_id');
                localStorage.removeItem('user_id');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
                window.location.reload();
                console.log("logoutres",res)
          
            }, error: (err: any) => {
               
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('user_id');
                localStorage.removeItem('user_id');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
                window.location.reload();
                this.router.navigate(['/home']);
             // this.dialog.openSnackBar({ message:'Login failed. Please try again.', title: 'Login failed'}, 'Error');
            }
         
          //this.router.navigate(['/login']);
          
        });
      }
    
      isLoggedIn(): boolean {
        return !!this.currentUserValue && !!this.currentUserValue.token;
      }
    
    verifyEmail(token: string) {
        return this.http.get(`${this.baseUrl}/api/verify_email/${token}`);
    }

    // /**@SIGN_UP_USER */
    // createPassword(body: any) {
    //     return this.http.post(`${this.baseUrl}/auth/signup/verify`, body);
    // }

    // /**@SEND_EMAIL_FOR_FORGOT_PASSWORD */
    // sendEmailForForgotPassword(body: any) {
    //     return this.http.post(`${this.baseUrl}/user/sendOtpTomail`, body);
    // }

    
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

   

}