import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './Services/Auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private Authguardservice: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isAuthenticated: any = this.Authguardservice.isAuthenticated();
        // console.log(isAuthenticated, 'isAuthenticated');

        const authData = this.Authguardservice.getAuthData();
        let url: string = state.url;

        console.log(url, 'url');
        
        if (!isAuthenticated) {
            this.router.navigateByUrl("/login");
            return true;
        }

        if (authData && url) {
            return true;
        }
        return isAuthenticated;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.Authguardservice.isAuthenticated();
    }
}