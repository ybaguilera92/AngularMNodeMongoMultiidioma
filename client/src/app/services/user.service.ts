
import { Usuario } from 'src/app/interfaces/usuario';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
// import 'rxjs/add/operator/map';
import { EnviromentsService } from './enviroments.service';
import { isNullOrEmpty } from '../fuse-config';
import { BaseService } from './base-service.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user';



// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<any> implements Resolve<any>, OnInit {
  headers = new HttpHeaders();
  onUserChanged: BehaviorSubject<any>;
  routeParams: any;
  user: any;
  public userSubject: BehaviorSubject<MatTableDataSource<any>>;
  public currentUser: Observable<MatTableDataSource<any>>;
  dataSource!: MatTableDataSource<User>;
  constructor(private http: HttpClient, private environment: EnviromentsService) {

    super(http, environment.getEnviroment().apiUrl, 'users');
    // Set the defaults
    this.onUserChanged = new BehaviorSubject({});
    this.userSubject = new BehaviorSubject<MatTableDataSource<User>>(null);
    this.currentUser = this.userSubject.asObservable();
    this.dataSource = new MatTableDataSource<User>();
  }
  ngOnInit(): void {
    console.log('hola');

  }
  setUsersSubject(value: any) {
    this.userSubject.next(value);
  }
  public get userValue(): MatTableDataSource<User> {
    return this.userSubject.value;
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getUser(this.routeParams['id'])
      ]).then(
        () => {

        },
        reject
      );
    });
  }
  getUser(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.environment.getEnviroment().apiUrl}/users/` + id)
        .subscribe((response: any) => {
          this.user = response;
         // console.log(this.user)
          this.onUserChanged.next(this.user);
          resolve(response);
        }, reject);
    });
  }
  getGrupos() {

    return this.http.get(`${this.environment.getEnviroment().apiUrl}/roles`)
      .pipe(
        map((data: any) => {

          return data;
        })
      );
  }
  addUser(params) {
    const parm = 'USER/createOne';
    return this.create(params, parm);
  }
  register(params) {
    const parm = 'USER/register';
    return this.create(params, parm);
  }
  deleteUser(params) {
    const parm = 'USER/modify-user/' + params;
   /// console.log(parm)
    return this.delete(params, parm);
  }
  updatePassword(item: any, index: any): Observable<any> {
    return this.http.post<any>(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + index, JSON.stringify(item), this.httpOptions)
      .pipe(
      // retry(2),
    )
  }
  saveUser(params) {
    const parm = 'USER/modify-user/' + params.id;
    return this.update(params, parm);
  }
  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
     
      /*if (this.userValue) {  
        //console.log('getUsers');
        resolve(this.userValue);
      }
      else {*/
        return this.http.get(`${this.environment.getEnviroment().apiUrl}/USER/getAll`).subscribe((response: any) => {
            console.log(response);
            this.dataSource.data = response as User[];
         //   this.userSubject.next(this.dataSource);
            resolve(this.dataSource);
          }, reject);
      
    });   
    
  }
  getUserOne(index: any) {
    return this.http.get(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + index);
    // return this.listusuarios.slice();
  }
  // deleteUser(index: any) {
  //   return this.http.delete(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + index);
  //   //this.listusuarios.splice(index, 1);
  // }
  // editarUsuario(index: number) {
  //   return this.http.put(AUTH_API + `users/users/${index}`, { headers: this.headers });
  //   //this.listusuarios.splice(index, 1);
  // }
  // agregarUsuario(usuario: Usuario) {
  //   return this.http.post(AUTH_API + 'users/users/', usuario, { headers: this.headers });
  // }
  // actualizarUsuario(index: number, usuario: Usuario) {
  //   return this.http.put(AUTH_API + `users/users/${index}/`, usuario, { headers: this.headers });
  // }
  // editarPassword(index: number, usuario: Usuario) {
  //   return this.http.post(AUTH_API + `users/users/${index}/set_password/`, usuario, { headers: this.headers });
  // }


  /*
   getGame(id: string) {
     return this.http.get(`${this.API_URI}/games/${id}`);
   }*/




  /*updateGame(id: string | number, updatedGame: Game): Observable<Game> {
    return this.http.put(`${this.API_URI}/games/${id}`, updatedGame);
  }*/




}
