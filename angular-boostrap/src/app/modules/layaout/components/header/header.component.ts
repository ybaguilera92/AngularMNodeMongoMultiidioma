import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/modules/auth/models/user';
import { AuthenticationService } from 'src/app/modules/auth/services/authentication.service';
import { TokenStorageService } from 'src/app/services/token.service';
import { AlertsService, AlertTypeEnum } from '../../services/alerts.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  logged = false; 
  subscription: any;

  constructor(
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private alertService: AlertsService

  ) {
    this.logged = this.authService.UserLoggedInSubject;
  }

  ngOnInit(): void {
   
  }
  logout() {
    this.subscription = this.authService.logout().subscribe(data => {
      let user = new User(null);
      this.tokenStorageService.signOut();
      this.authService.setCurrentUserSubject(user);
      this.authService.setUserLoggedInSubject(false);
      let value: any;
      value = data;
      this.alertService.showMessage({
        message: value.msg,
        title: "Success",
        type: AlertTypeEnum.Success
      });
      this.router.navigate([''])
      
    });
  }
}
