import { AuthenticationService } from 'src/app/services/authentication.service';
import { isNullOrEmpty } from 'src/app/fuse-config/index';
import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';


import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";

@Component({
    selector     : 'account-activation',
    templateUrl  : './account-activation.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AccountActivationComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input() public email : string;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _route: ActivatedRoute,
        private _authenticationService: AuthenticationService,
        public _router: Router,
        private _snackBar: MatSnackBar
    )
    {
        // Configure the layout
     
    }

    ngOnInit() {
        this.subscription = this._route.queryParams.subscribe(params => {
            if (!isNullOrEmpty(params['code'])) {                
                this._authenticationService.activate(params['code']).subscribe(res => {
                    if (res) {
                        this.fakeloading("Activación satisfactoria. Puede iniciar sesión.");
                    } else {
                        this.error("Código de activación no válido.");
                     }
                                          
                    },
                    error => {
                        this.error("Código de activación no válido.");
                    });
            } else {
                this.error("Debe introducir un código de activación.");
            }

        });
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    fakeloading(mensage: string) {
        setTimeout(() => { this._router.navigate(['/login']) }
            , 200);
        Swal.fire({
            title: 'Error:',
            text: mensage,
            icon: 'info'
        });
       
    }
    error(mensage: string) {
        setTimeout(() => { this._router.navigate(['/login']) }
            , 200);
        Swal.fire({
            title: 'Atención:',
            text: mensage,
            icon: 'error'
        });
      
    }
}
