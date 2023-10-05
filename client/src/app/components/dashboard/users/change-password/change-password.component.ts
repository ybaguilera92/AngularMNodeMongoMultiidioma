import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { User } from '../../../../models/user';
import { TokenStorageService } from 'src/app/services/token.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { takeUntil, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modificar-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  id = 0;
  editar = false;
  form: FormGroup;
  user: User;
  private _unsubscribeAll: Subject<any>;
  // user = {
  //   password: "",
  //   password2: "",

  // }

  // sexos: any[] = [
  //   { value: 'M', viewValue: 'Masculino' },
  //   { value: 'F', viewValue: 'Femenina' },
  // ];
  constructor(private fb: FormBuilder,
    public dialogo: MatDialogRef<ChangePasswordComponent>,
    private _userService: UserService, private translate: TranslateService, private tokenStorage: TokenStorageService, private _authenticationService: AuthenticationService, private _snackBar: MatSnackBar, private router: Router, private activedRoute: ActivatedRoute) {
    this._unsubscribeAll = new Subject();
    this.form = this.fb.group({
      passwordCurrent: ['', [Validators.required]],
      passwordNew: ['', [Validators.required]],
      password: ['', [Validators.required]],

    })
  }
  ngOnInit(): void {
    if (this.tokenStorage.getUser()) {
      this.user = this.tokenStorage.getUser();

    } else {
      this.router.navigate(['/users']);
    }
  }

  savePassword() {
    const data = this.form.getRawValue();
    const userPassword = {
      "passwordCurrent": data.passwordCurrent,
      "passwordNew": data.passwordNew
    }
    if (data.passwordNew != data.password) {
      this.error("Las contraseñas no coinciden.");
    } else {
      this._userService.updatePassword(userPassword, this.user._id).pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res) => {           
            // Show the success message
            this.translate.stream(res.msg)
              .subscribe((res: string) => {
                this.error(res);
              });
            this.dialogo.close(false);
            // this.error("Contraseñas actualizada correctamente.");
            this.router.navigate(['/']);
          },
          error: (err) => {
            //console.log(err.error.msg)
            if (err.status == 400) {
              if (err.error.msg.indexOf("Current password not macth!") > -1) {
                this.form.get('passwordCurrent').setErrors({ 'unique': true });
              }
              if (err.error.msg.indexOf("Password new exist!") > -1) {
                this.form.get('passwordNew').setErrors({ 'unique': true });
              }
              this.form.markAllAsTouched();
            }
          }
        });
    }
    // console.log(data);
  }
  cerrarDialogo() {
    this.dialogo.close(false);
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
