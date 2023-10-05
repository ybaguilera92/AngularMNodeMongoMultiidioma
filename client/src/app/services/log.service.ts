import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
// import 'rxjs/add/operator/map';
import { EnviromentsService } from './enviroments.service';
import { BaseService } from './base-service.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user';
import { Log } from '../models/log';



// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };
@Injectable({
  providedIn: 'root'
})
export class LogService  {
  headers = new HttpHeaders();
  onUserChanged: BehaviorSubject<any>;
  routeParams: any;
  user: any; 
  dataSource!: MatTableDataSource<Log>;
  constructor(private http: HttpClient, private environment: EnviromentsService) {
    // Set the defaults
    this.onUserChanged = new BehaviorSubject({});
    this.dataSource = new MatTableDataSource<Log>();
  }

 
  getGrupos() {
    return this.http.get(`${this.environment.getEnviroment().apiUrl}/roles`)
      .pipe(
        map((data: any) => {

          return data;
        })
      );
  }

 
  getLogs(): Promise<any> {
    return new Promise((resolve, reject) => {

        return this.http.get(`${this.environment.getEnviroment().apiUrl}/LOG/logs`).subscribe((response: any) => {
            this.dataSource.data = response as Log[];
            resolve(this.dataSource);
          }, reject);
      
    });   
    
  }

}
