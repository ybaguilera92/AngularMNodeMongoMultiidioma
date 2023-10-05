import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from "@angular/material/dialog";
import { User } from 'src/app/models/user';
import { Subject } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';
import { Log } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  listUser: any = [];
  user: Log;
  objetoJson: any;
  id = localStorage.getItem('id');

  //listUser: Usuario = [];
  displayedColumns: string[] = ['viewSend', 'action', 'response', 'name', 'user', 'createAt'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Private
  private _unsubscribeAll: Subject<any>;
  /**
    * Constructor
    */
  constructor(private _logService: LogService,
    private _snackBar: MatSnackBar,
    public dialogo: MatDialog,
    private translate: TranslateService,
    private tokenStorage: TokenStorageService) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {    
    this.chargeUsers();
  }
  chargeUsers() {   
    this._logService.getLogs().then(data => this.dataSource.data = data.data);
    // this._logService.userSubject.subscribe({
    //   next: (c) => {
    //     if (c) {
    //       console.log('hh');
    //       this.dataSource.data = c.data;
    //     } else {
    //       this._logService.getUsers().then(data => this.dataSource.data = data.data);
    //     }
    //   }, error: (err) => {
    //     console.log(err);
    //   }
    // });


    // this._logService.getUsers().subscribe({
    //   next: (c) => {
    //     this.listUser = c;         
    //     // this.dataSource = new MatTableDataSource(this.listUser);
    //     this.dataSource.data = this._logService.currentUserValue.data

    //     if (this.listUser.length == 0) {
    //       this.error('No hay usuarios en la base de datos para mostrar!!');
    //     }
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
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

 
  
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
