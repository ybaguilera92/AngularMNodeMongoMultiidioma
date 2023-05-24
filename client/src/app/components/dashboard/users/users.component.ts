import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/interfaces/usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from "@angular/material/dialog";
import { DialogoConfirmacionComponent } from "../dialogo-confirmacion/dialogo-confirmacion.component";
import { User } from 'src/app/models/user';
import { Subject, takeUntil } from 'rxjs';
import { isNullOrEmpty } from 'src/app/fuse-config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TokenStorageService } from 'src/app/services/token.service';
import { TranslateService } from '@ngx-translate/core';
import { FormUserComponent } from './form-user/form-user.component';
import { ProfileComponent } from './profile/profile.component';
@Component({
  selector: 'app-usuarios',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listUser: any = [];
  user: User;
  objetoJson: any;
  currentUser: User;
  id = localStorage.getItem('id');

  //listUser: Usuario = [];
  displayedColumns: string[] = ['username', 'name', 'email', 'rol', 'enable', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Private
  private _unsubscribeAll: Subject<any>;
  /**
    * Constructor
    */
  constructor(private _userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialogo: MatDialog,
    private _authenticationService: AuthenticationService,
    private translate: TranslateService,
    private tokenStorage: TokenStorageService) {
    this.user = new User(tokenStorage.getUser());
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {
    console.log('hola')
    this.chargeUsers();
  }
  chargeUsers() {
    console.log('carga')
    this._userService.getUsers().then(data => this.dataSource.data = data.data);
    // this._userService.userSubject.subscribe({
    //   next: (c) => {
    //     if (c) {
    //       console.log('hh');
    //       this.dataSource.data = c.data;
    //     } else {
    //       this._userService.getUsers().then(data => this.dataSource.data = data.data);
    //     }
    //   }, error: (err) => {
    //     console.log(err);
    //   }
    // });


    // this._userService.getUsers().subscribe({
    //   next: (c) => {
    //     this.listUser = c;         
    //     // this.dataSource = new MatTableDataSource(this.listUser);
    //     this.dataSource.data = this._userService.currentUserValue.data

    //     if (this.listUser.length == 0) {
    //       this.error('No hay usuarios en la base de datos para mostrar!!');
    //     }
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
  }
  mostrarDialogo(index: any): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `¿Está seguro que desea eliminar el usuario?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.deleteUser(index);
        }
      });
  }
  mostrarDialogoAdd(): void {
    this.dialogo
      .open(FormUserComponent, {
        height: '63%',
        width: '60%',
      })
      .afterClosed()
      .subscribe((addUser: Boolean) => {
        console.log(addUser);
        if (addUser) {
          this.chargeUsers();
        }
      });
  }
  deleteUser(index: any) {
    if (this.user._id == index) {
      this.error("No puede eliminar su usuario!!")
    } else {
      this._userService.deleteUser(index).
        subscribe({
          next: (c) => {
            // this.dataSource.data = this._userService.userValue.data;
            // var found = this.dataSource.data.findIndex(e => e._id === index);
            // this.dataSource.data.splice(found, 1);
          //  this._userService.setUsersSubject(this.dataSource);
            this.chargeUsers();
            this.translate.stream('Delete User')
              .subscribe((res: string) => {
                this.error(res);
              });
          },
          error: (err) => {
            if (err.status == 400 || err.status == 409) {
              this.error(err.error.message);
            }
          }
        });
    }


  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarUsuario(index: any) {
    localStorage.setItem('id_user', index);
    this.dialogo
      .open(FormUserComponent, {
        height: '55%',
        width: '60%',
      }).afterClosed()
      .subscribe((saveUser: Boolean) => {
        console.log(saveUser);
        if (saveUser) {
          this.chargeUsers();
        }
      });
    // this.router.navigate(['/edit-user']);
  }
  mostrarUsuario(index: any) {

    localStorage.setItem('id_usuario', '' + index);
    localStorage.setItem('id_user', index);
    this.dialogo
      .open(ProfileComponent, {
        height: '63%',
        width: '60%',
      });
  //  this.router.navigate(['/profile']);

  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
