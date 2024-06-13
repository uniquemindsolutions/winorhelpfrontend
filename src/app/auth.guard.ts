import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './Services/Auth.service';
import { inject } from '@angular/core';
export const AuthGuard: CanActivateFn = (route, state) => {
    const router=inject(Router);
    // const authService=inject(AuthService);
    const isAuthenticated: any = inject(AuthService).isAuthenticated();
    const authData = inject(AuthService).getAuthData();
    let url: string = state.url;
    console.log(url, 'url');
    // if (!isAuthenticated) {
    //     router.navigateByUrl("/login");
    //     return false;
    // }
    // if (authData && url) {
    //     router.navigateByUrl("/");
    //     return true;
    // }
    // return isAuthenticated;
    
    return true;
};

export const canActivateChild: CanActivateChildFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return true;
        // if (route.routeConfig?.path === '' || inject(AuthService)?.userRole === 'admin') {
        //     return true;
        //   } else {
        //     inject(Router).navigate(['/access-denied']);
        //     return false;
        //   }      
        // if (route.routeConfig?.path === '' || inject(AuthService)?.userRole === 'admin') {
        //     return true;
        //   } else {
        //     inject(Router).navigate(['/access-denied']);
        //     return false;
        //   }      
};