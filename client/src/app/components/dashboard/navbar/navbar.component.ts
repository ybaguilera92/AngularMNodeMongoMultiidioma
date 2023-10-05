import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordComponent } from '../users/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../users/profile/profile.component';
import { TokenStorageService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';
interface Idioma {
  id: string
  name: string;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit {
  idioma: any;
  logged = false;
  provincias: Idioma[] = [
    { id: 'es', name: 'Español' },
    { id: 'en', name: 'Inglés' },

  ];
  subscription: any;
  langs: any[] = [];
  menu: Menu[] = [];
  @Output() public sidenavToggle = new EventEmitter();
  constructor(private _menuservice: MenuService,
    public dialogo: MatDialog,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService
   
  ) {
    if (!localStorage.getItem("idioma")) {
      localStorage.setItem("idioma", 'es');
    }
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang(localStorage.getItem("idioma"));
    this.idioma = this.translate.defaultLang;
    this.langs = this.provincias;
    this.logged = this.authService.UserLoggedInSubject;
  }

  ngOnInit(): void {
    this.cargarMenu()
  }
  cargarMenu() {
    this._menuservice.getMenu().subscribe(data => {
      this.menu = data;
    })
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  logout() {
    this.subscription = this.authService.logout().subscribe(data => {
      let user = new User(null); 
      this.tokenStorageService.signOut();
      this.authService.setCurrentUserSubject(user);
      this.authService.setUserLoggedInSubject(false);      
      this.translate.stream(data['msg'])
        .subscribe((res: string) => {
          this.fakeloading(res);
        });
    });
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  fakeloading(mensage: string) {
    setTimeout(() => { this.router.navigate(['login']); this.subscription.unsubscribe(); }
      , 200);
    this._snackBar.open(mensage, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    localStorage.removeItem("idioma");
  }
  changeLang(lang: string) {
    console.log("hola");
    this.translate.use(lang);
    localStorage.setItem("idioma", lang);
    this.idioma = this.translate.currentLang;
    
  }
  profile() {
    this.dialogo
      .open(ProfileComponent, {
        height: '63%',
        width: '60%',
      });
  }
  changePassword() {
    this.dialogo
      .open(ChangePasswordComponent, {
        height: '55%',
        width: '50%',
      });
  }
}
