import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from "../services/authentication.service";
import { TokenStorageService } from "../services/token.service";
import { isNullOrEmpty } from "../fuse-config";
import { User } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private tokenStorage: TokenStorageService,
        private _snackBar: MatSnackBar,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const user = new User(this.tokenStorage.getUser());
        if (!isNullOrEmpty(user)) {
         
            // check if route is restricted by role
            if (!this.authenticationService.UserLoggedInSubject) {
                this.router.navigate(['/login']);
                return false;
            }
            if (user.role != "Administrator") {
                // role not authorised so redirect to home page
                if (this.authenticationService.UserLoggedInSubject) {         
                    this.authenticationService.logout();
                }
                this.router.navigate(['/']);
                this.error('No está autorizado!!')
                return false;
            }

            // authorised so return true
            return true;
        }
        console.log('hola')
        // not logged in so redirect to login page with the return url
        //  this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/login']);
        return false;
    }
    error(error: string) {
        this._snackBar.open(error, '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}