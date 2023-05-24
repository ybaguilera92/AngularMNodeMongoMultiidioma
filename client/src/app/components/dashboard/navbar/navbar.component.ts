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
  langs: any[] = [];
  menu: Menu[] = [];
  @Output() public sidenavToggle = new EventEmitter();
  constructor(private _menuservice: MenuService,
    public dialogo: MatDialog,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private _snackBar: MatSnackBar,
   
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
    this.authService.logout().subscribe(data => {

      this.translate.stream(data['msg'])
        .subscribe((res: string) => {
          this.fakeloading(res);
        });
    });
    //  this.fakeloading('Sesión cerrada satisfactoriamente');

    //this.fakeloading();
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  fakeloading(mensage: string) {
    setTimeout(() => { this.router.navigate(['login']) }
      , 200);
    this._snackBar.open(mensage, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("idioma", lang);
    this.idioma = this.translate.currentLang;
  }
  changePassword() {
    this.dialogo
      .open(ChangePasswordComponent, {
        height: '55%',
        width: '50%',
      });
  }
}
