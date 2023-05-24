import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../services/authentication.service';
import Swal from "sweetalert2";
import { TokenStorageService } from 'src/app/services/token.service';
import { first, interval } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
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
    private tokenStorage: TokenStorageService
  ) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    }
    );
  }

  ngOnInit(): void {
  }
  get f() { return this.form.controls; }
  recuperar() {

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    //const data = this.form.getRawValue();    
    this.authenticationService.recovery(this.form.getRawValue())
      .pipe(first())
      .subscribe(
        data => {
          // if (data.accessToken == "Usuario inactivo") {
          Swal.fire({
            title: 'Atención',
            text: "Se ha enviado la nueva contraseña a su correo electrónico.",
            icon: 'info'
          })

          /* const numbers = interval(2500);
           const takeFourNumbers = numbers.pipe();
           takeFourNumbers.subscribe(x =>
             window.location.reload()
           );*/
        },
        error => {
          this.error = error;
          let message = '';

          Swal.fire({
            title: 'Correo no existe!!',
            text: message,
            icon: 'error'
          });
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
    setTimeout(() => { this.router.navigate(['dashboard']) }
      , 600)
  }

}
