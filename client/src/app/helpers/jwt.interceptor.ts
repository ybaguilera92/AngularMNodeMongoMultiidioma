import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private translate: TranslateService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Hola55555');
        console.log(localStorage.getItem("idioma"));
    //    this.translate.setDefaultLang(localStorage.getItem("idioma"));
        // add authorization header with jwt token if available       
        let currentUser = this.authenticationService.currentUserValue;
       // console.log(currentUser.token);
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                    language: localStorage.getItem("idioma")
                }
             
            });
        }

        return next.handle(request);
    }
}