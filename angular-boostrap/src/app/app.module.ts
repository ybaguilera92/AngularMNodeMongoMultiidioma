import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { Grafic1Component } from './pages/grafic1/grafic1.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './modules/layaout/components/header/header.component';
import { SidebarComponent } from './modules/layaout/components/sidebar/sidebar.component';
import { BreadcrumsComponent } from './modules/layaout/components/breadcrums/breadcrums.component';
import { FooterComponent } from './modules/layaout/components/footer/footer.component';
import { EnviromentsService } from './services/enviroments.service';
import { EncryptionService } from './services/encryption.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,    
    DashboardComponent,
    ProgressComponent,
    Grafic1Component,
    HeaderComponent,
    SidebarComponent,
    BreadcrumsComponent,
    FooterComponent,
    PagesComponent,
    
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
    })
  ],
  providers: [EnviromentsService,
    EncryptionService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
