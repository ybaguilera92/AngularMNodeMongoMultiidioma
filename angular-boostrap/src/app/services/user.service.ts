import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
// import 'rxjs/add/operator/map';
import { EnviromentsService } from './enviroments.service';
import { BaseService } from './base-service.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { User } from '../modules/auth/models/user';



// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<any> implements OnInit {
  headers = new HttpHeaders();
  onUserChanged: BehaviorSubject<any>;
  routeParams: any;
  user: any;
  data: User[] = [];
  constructor(private http: HttpClient, private environment: EnviromentsService) {

    super(http, environment.getEnviroment().apiUrl, 'users');

    // Set the defaults
    this.onUserChanged = new BehaviorSubject({});
  }
  ngOnInit(): void {
    console.log('hola');

  }

  getGrupos() {
    return this.http.get(`${this.environment.getEnviroment().apiUrl}/roles`)
      .pipe(
        map((data: any) => {

          return data;
        })
      );
  }

  addUser(params: any) {
    const parm = 'USER/addUser';
    return this.create(params, parm);
  }

  register(params: any) {
    const parm = 'USER/register';
    return this.create(params, parm);
  }

  deleteUser(params: any): Observable<any> {
    return this.http.put<any>(`${this.environment.getEnviroment().apiUrl}/USER/deleteUser/` + params, this.httpOptions);
  }
  changeState(params: any): Observable<any> {
    return this.http.patch<any>(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + params, this.httpOptions);
  }

  updatePassword(item: any, index: any): Observable<any> {
    return this.http.post<any>(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + index, JSON.stringify(item), this.httpOptions);
  }

  saveUser(params: any) {
    const parm = 'USER/modify-user/' + params._id;
    return this.update(params, parm);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.environment.getEnviroment().apiUrl}/USER/getUsers`, this.httpOptions);
  }
  getUserOne(index: any) {
    return this.http.get(`${this.environment.getEnviroment().apiUrl}/USER/modify-user/` + index);
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




}
