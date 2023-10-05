import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TokenStorageService } from 'src/app/services/token.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService, AlertTypeEnum } from 'src/app/modules/layaout/services/alerts.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  langs: string[] = [];
  form: FormGroup;
  idioma: any;
  loading = false;
  errorMessage = '';
  isLoginFailed = false;
  errorAux: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private translate: TranslateService,
    private alertService: AlertsService
  ) {
    if (!localStorage.getItem("idioma")) {
      localStorage.setItem("idioma", 'es');
    }
    // this.translate.addLangs(['es', 'en']);
    // this.langs = this.translate.getLangs();
    // this.idioma = this.translate.defaultLang;
    this.form = this.fb.group({
      username: ['', Validators.required],
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
    const username = this.form.value.username;
    const password = this.form.value.password;

    this.authService.login(username, password).subscribe({
      next: data => {
        console.log(data)
        if (data.accessToken == "username inactivo") {
          this.alertService.showMessage({
            message: "Su cuenta de usuario aún se encuentra inactiva, revise su correo y actívela haciendo click en el enlace enviado",
            title: "Atención:",
            type: AlertTypeEnum.Info
          });

        } else {
          this.tokenStorage.saveUser(data);
          this.tokenStorage.saveToken(data.token);

          this.alertService.showMessage({
            message: `Welcome ${data.username}!!`,
            title: "Success",
            type: AlertTypeEnum.Success
          });
          this.router.navigate(['/dashboard'])
        }

      },
      error: error => {
        
        if (error.error.msg.indexOf("Username is not register!") > -1) {
          this.form.get('username')?.setErrors({ 'unique': true });
        } else if (error.error.msg.indexOf("Password incorrect!") > -1) {
          this.form.get('password')?.setErrors({ 'unique': true });
        } else {
          this.errorAux = error;
          let message = this.errorAux.error.msg;
          console.log(message)
          this.alertService.showMessage({
            message: message,
            title: "Error",
            type: AlertTypeEnum.Danger
          });

        }
      }
    });
  }

}
