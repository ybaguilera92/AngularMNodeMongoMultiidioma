import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { TokenStorageService } from 'src/app/services/token.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { isNullOrEmpty } from 'src/app/fuse-config';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  id = 0;
  rol = '';
  local: any;
  user: User;
  private _unsubscribeAll: Subject<any>;
  constructor(public dialogo: MatDialogRef<ProfileComponent>,
    private _userService: UserService, private _authenticationService: AuthenticationService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private router: Router) {
    this.user = new User(null);
    this._unsubscribeAll = new Subject();
  }
  ngOnDestroy() {
    if (localStorage.getItem('id_usuario') != null) {
      localStorage.removeItem('id_usuario');
    }
  }
  ngOnInit(): void {
    if (localStorage.getItem('id_usuario') != null) {
      this._userService.getUserOne(localStorage.getItem('id_usuario')).subscribe({
        next: (c) => {
          this.user = new User(c);
         // this.rol = this.user.roles[0].name;
        },
        error: (err) => {
          this.error(err.error.message);
          this.router.navigate(['/users']);
        }
      });
    } else {
      console.log('hi')
      this._authenticationService.currentUser.pipe(takeUntil((this._unsubscribeAll))).subscribe((user) => {
        this.user = !isNullOrEmpty(user) ? user : !isNullOrEmpty(this.tokenStorage.getUser()) ? this.tokenStorage.getUser() : null;
      });
      console.log(this.user)
   //   this.user = this.tokenStorage.getUser();
     // this.rol = this.user.roles[0];
    }
  }
  regresar() {
    localStorage.removeItem('id_usuario');
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
