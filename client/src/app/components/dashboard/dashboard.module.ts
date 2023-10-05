import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersComponent } from './users/users.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProfileComponent } from './users/profile/profile.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DialogoConfirmacionComponent } from "./dialogo-confirmacion/dialogo-confirmacion.component";
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

import { UsersModule } from './users/users.module';
import { RouterModule, Routes } from '@angular/router';
import { LogsModule } from './logs/logs.module';
const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'reports', component: ReportesComponent },


    ]
  },

];

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    ReportesComponent,     
    SidenavComponent,
    DialogoConfirmacionComponent,
    SidenavListComponent,
    
   
  ],
  imports: [
    CommonModule,
    UsersModule,
    LogsModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
