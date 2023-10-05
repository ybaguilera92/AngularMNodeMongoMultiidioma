import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { Grafic1Component } from './pages/grafic1/grafic1.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagesComponent } from './pages/pages.component';
import { RegisterComponent } from './modules/auth/components/register/register.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'grafic1', component: Grafic1Component },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    ]
  },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(x => x.DashboardModule) },
  { path: '**', redirectTo: 'no-authorized', pathMatch: 'full' },
  { path: 'no-authorized', component: NopagefoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
