import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
import { TokenStorageService } from 'src/app/services/token.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  idioma: any;
  langs: string[] = [];
  form: FormGroup;
  loading = false;
  errorMessage = '';
  isLoginFailed = false;
  errorAux: any;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _userService: UserService,
    private tokenStorage: TokenStorageService,
    private translate: TranslateService
  ) {

    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._-]{3,16}')])],
      name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]{3,20}')])],
      lastname: ['', Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]+$')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^(.+)@(\\S+)$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],


    })
  }
  register() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.getRawValue();
    // console.log(data.lastname)
    this._userService.register({
      "password": data.password,
      "username": data.username,
      "name": data.name,
      "lastname": data.lastname,
      "email": data.email

    }).subscribe(res => {
      this._userService.onUserChanged.next(data);

      // Show the success message
      this.translate.stream('New user create')
        .subscribe((res: string) => {
          this.error(res);
        });
    },
      error => {
        if (error.status == 400) {
          // console.log(error.error.msg);
          if (error.error.msg.indexOf("This email is already registered!") > -1) {
            this.form.get('email').setErrors({ 'unique': true });
          } else if (error.error.msg.indexOf("This username is already registered!") > -1) {
            this.form.get('username').setErrors({ 'unique': true });
          }
          this.form.markAllAsTouched();
        }
      });


  }
  ngOnInit(): void {
    if (!localStorage.getItem("idioma")) {
      localStorage.setItem("idioma", 'es');
    }
    this.translate.addLangs(['es', 'en']);
    this.langs = this.translate.getLangs();
    this.translate.setDefaultLang(localStorage.getItem("idioma"));
    this.idioma = this.translate.defaultLang;
  }

  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  // fakeloading() {
  //   this.loading = true;
  //   setTimeout(() => { this.router.navigate(['dashboard']) }
  //     , 600)
  // }
  changeLang(lang: string) {   
    this.translate.use(lang);   
    localStorage.setItem("idioma", lang);   
    this.idioma = this.translate.currentLang;  
    
   

  }
}
