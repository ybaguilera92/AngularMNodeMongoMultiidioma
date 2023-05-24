import { AuthenticationService } from 'src/app/services/authentication.service';
//import { Grupo } from 'src/app/interfaces/grupo';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { UserService } from 'src/app/services/user.service';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { Observable, startWith, map, Subject, takeUntil } from 'rxjs';
import { User } from '../../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit, OnDestroy {
  id = 0;
  editar = false;
  form: FormGroup;
  user: User;
  options = [
    { id: true, desc: 'Activo' },
    { id: false, desc: 'Inactivo' }
  ];
  roles: any;
  dataSource!: MatTableDataSource<any>;
  private _unsubscribeAll: Subject<any>;

  // sexos: any[] = [
  //   { value: 'M', viewValue: 'Masculino' },
  //   { value: 'F', viewValue: 'Femenina' },
  // ];
  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    public dialogo: MatDialogRef<FormUserComponent>,
    
  ) {
    this.user = new User(null);
    this._unsubscribeAll = new Subject();
    this.dataSource = new MatTableDataSource<User>();
    this.roles = ['Administrator', 'Other'];
    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._-]{3,16}')])],
      name: ['', Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]+$')])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]+$')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^(.+)@(\\S+)$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      enabled: ['', Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])]
    });
  }
  ngOnDestroy() {
    if (localStorage.getItem('id_user') != null) {
      localStorage.removeItem('id_user');
      this.editar = false;
      //console.log('hola');
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  cerrarDialogo(): void {
    this.dialogo.close(false);
  }

  ngOnInit(): void {    
    if (localStorage.getItem('id_user') != null) {
      this._userService.getUserOne(localStorage.getItem('id_user')).subscribe({
        next: (c) => {
          this.user = new User(c);         
          this.editar = true;
          //localStorage.setItem('id_user', params["id"]);
          this.form = this.fb.group({
            id: [this.user._id],
            username: [this.user.username, Validators.compose([Validators.required, Validators.pattern('[a-z0-9._-]{3,16}')])],
            name: [this.user.name, Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]+$')])],
            lastName: [this.user.lastName, Validators.compose([Validators.required, Validators.pattern('^[A-ZÑa-zñáéíóúÁÉÍÓÚ° ]+$')])],
            email: [this.user.email, [Validators.required, Validators.pattern('^(.+)@(\\S+)$')]],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            enabled: [this.user.enabled, Validators.compose([Validators.required])],
            role: [this.user.role, Validators.compose([Validators.required])],
          })
        },
        error: (err) => {
          this.error(err.error.message);
          this.router.navigate(['/users']);
        }
      });
    } 
  }  
  saveUser(): void {

    const data = this.form.getRawValue();

    this._userService.saveUser({
      "id": data.id,
      "username": this.user.username,
      "name": data.name,
      "lastName": data.lastName,
      "email": data.email,
      "roles": [data.role],
      "enabled": data.enabled
    }).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {       
        // this.dataSource.data = this._userService.userValue.data;
        // var found = this.dataSource.data.findIndex(e => e._id === data.id );
        // this.dataSource.data[found].name = data.name;
        // this.dataSource.data[found].lastName = data.lastName;
        // this.dataSource.data[found].role = data.role;
        // this.dataSource.data[found].email = data.email;
        // this.dataSource.data[found].enabled = data.enabled;
        // console.log(this.dataSource.data);
        // //this.dataSource.data.push(data);
        // this._userService.setUsersSubject(this.dataSource);
        // this._userService.userValue.data.push(res);
       // this._userService.onUserChanged.next(res);       
        // Show the success message
        this.translate.stream('User update')
          .subscribe((res: string) => {
            this.fakeloading(res);
          });

      },
        error => {
          if (error.status == 400) {
            console.log("hola");
            this.form.markAllAsTouched();
          }
        });
  }
  addUser(): void {
    const data = this.form.getRawValue();
    // console.log(data.lastname)
    this._userService.addUser({
      "password": data.password,
      "username": data.username,
      "name": data.name,
      "lastName": data.lastName,
      "email": data.email,
      "role": data.role,
      "enabled": data.enabled
    }).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
       // this._userService.onUserChanged.next(data);  
        // this.dataSource.data = this._userService.userValue.data;
        // this.dataSource.data.push(data);
        // this._userService.setUsersSubject(this.dataSource);
        // Show the success message
        this.translate.stream('New user create')
          .subscribe((res: string) => {
            this.fakeloading(res);
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

  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  fakeloading(mensage: string) {
    setTimeout(() => {
      this.dialogo.close(true);
      this.router.navigate(['/users']);
     // window.location.reload();
    }
      , 100);
    this._snackBar.open(mensage, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
