import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from "../../../services/token.service";
import { isNullOrEmpty } from "../../../fuse-config";
import { User } from '../models/user';
import { environment } from 'src/environments/environment';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private isUserLoggedInSubject: BehaviorSubject<boolean>;
    public isUserLogged: Observable<boolean>;

    constructor(private http: HttpClient,
        private tokenStorageService: TokenStorageService,
        private router: Router) {

        this.currentUserSubject = new BehaviorSubject<User>(this.tokenStorageService.getUser());
        this.currentUser = this.currentUserSubject.asObservable();

        this.isUserLoggedInSubject = new BehaviorSubject<boolean>(!isNullOrEmpty(this.tokenStorageService.getUser()));
        this.isUserLogged = this.isUserLoggedInSubject.asObservable();

        if (!isNullOrEmpty(this.tokenStorageService.getUser())) {
            this.currentUserSubject.next(this.tokenStorageService.getUser());
            this.isUserLoggedInSubject.next(true);
        }
    }
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    setCurrentUserSubject(value: any) {
        this.currentUserSubject.next(value);
    }

    setUserLoggedInSubject(value: any) {
        this.isUserLoggedInSubject.next(value);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    public get UserLoggedInSubject(): boolean {
        return this.isUserLoggedInSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/USER`, { username, password }, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        })
            .pipe(map(user => {
                if (user.accessToken != "Usuario inactivo") {
                    this.currentUserSubject.next(user);
                    this.isUserLoggedInSubject.next(true);
                } else {
                    this.isUserLoggedInSubject.next(false);
                }
                return user;
            }));
    }
    recovery(body: any) {
        body.siteURL = `${environment.appUrl}/auth/recovery-password`;

        return this.http.post<any>(`${environment.apiUrl}/auth/recoveryPassword`, body)
            .pipe(map(user => {
                return user;
            }));
    }

    /* register(body: any) {
         
         body.password_confirmation = body.passwordConfirm;
         body.siteURL = `${environment.appUrl}/auth/activate`;
        
         return this.http.post<any>(`${environment.apiUrl}/auth/signup`, body)
             .pipe(map(user => {
                 return user;
             }));
     }*/


    activate(token: any) {
        let params = new HttpParams().set("code", token); //Create new HttpParams
        return this.http.get<any>(`${environment.apiUrl}/auth/verify`, { params })
            .pipe(map(user => {
                return user;
            }));
    }
    recoverPassword(token: any) {
        let params = new HttpParams().set("code", token); //Create new HttpParams       
        return this.http.get<any>(`${environment.apiUrl}/auth/verifyPassword`, { params })
            .pipe(map(user => {
                return user;
            }));
    }
    logout() {
        //let user = new User(null);     
        // this.tokenStorageService.signOut();
        //this.currentUserSubject.next(user);
        //this.isUserLoggedInSubject.next(false);          
        return this.http.post(`${environment.apiUrl}/USER/signOut/_`, this.httpOptions);
        // this.router.navigate(['/']);      
    }

    refreshToken(token: string) {
        return this.http.post(`${environment.apiUrl}/auth/refreshtoken`, {
            refreshToken: token
        });
    }
}