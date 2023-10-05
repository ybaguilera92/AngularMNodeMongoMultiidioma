import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard.component';
import { LogsComponent } from './logs.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'logs', component: LogsComponent, canActivate: [AuthGuard] },     
    ]
  },

];
@NgModule({
  declarations: [
   LogsComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export class LogsModule { }
