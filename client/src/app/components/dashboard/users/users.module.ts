import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard.component';
import { HomeComponent } from '../home/home.component';
import { ReportesComponent } from '../reportes/reportes.component';
import { UsersComponent } from './users.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { FormUserComponent } from './form-user/form-user.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'add-user', component: FormUserComponent, canActivate: [AuthGuard] },
      { path: 'edit-user', component: FormUserComponent, canActivate: [AuthGuard] },
      // { path: 'editar-usuario', component: EditarUsuarioComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    ]
  },

];
@NgModule({
  declarations: [
    UsersComponent,
    FormUserComponent,
    ProfileComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
