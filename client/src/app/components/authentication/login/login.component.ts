import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import Swal from "sweetalert2";
import { TokenStorageService } from 'src/app/services/token.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  langs: string[] = [];
  form: FormGroup;
  idioma: any;
  loading = false;
  errorMessage = '';
  isLoginFailed = false;
  errorAux: any;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private translate: TranslateService
  ) {
    if (!localStorage.getItem("idioma")) {
      localStorage.setItem("idioma", 'es');
    }
    this.translate.addLangs(['es', 'en']);
    this.langs = this.translate.getLangs();
    this.translate.setDefaultLang(localStorage.getItem("idioma"));
    this.idioma = this.translate.defaultLang;
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    }
    );
  }
  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("idioma", lang);
    this.idioma = this.translate.currentLang;
  }
  ngOnInit(): void {
  }
  ingresar() {
    const user = this.form.value.usuario;
    const password = this.form.value.password;
    this.authService.login(user, password).subscribe({
      next: data => {
        if (data.accessToken == "Usuario inactivo") {
          Swal.fire({
            title: 'Atención:',
            text: "Su cuenta de usuario aún se encuentra inactiva, revise su correo y actívela haciendo click en el enlace enviado",
            icon: 'info'
          })

        } else {
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          //console.log(this.tokenStorage.getUser());
          //   window.location.reload();
          // console.log(this.tokenStorage.getUser());
          this.fakeloading();
        }


      },
      error: error => {

        if (error.error.msg.indexOf("Username is not register!") > -1) {
          this.form.get('usuario').setErrors({ 'unique': true });
        } else if (error.error.msg.indexOf("Password incorrect!") > -1) {
          this.form.get('password').setErrors({ 'unique': true });
        } else {
          this.errorAux = error;
          let message = this.errorAux.error.msg;
          this.translate.stream(message)
            .subscribe((res: string) => {              
              //  message = "{{'User' | translate}}"
              Swal.fire({
                title: 'Error:',
                text: res,
                icon: 'error'
              });
            });

        }
      }
    });
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  fakeloading() {
    this.loading = true;
    setTimeout(() => { this.router.navigate(['/home']) }
      , 600)
  }

}
