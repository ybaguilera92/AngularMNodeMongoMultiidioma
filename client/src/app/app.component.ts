import { Component } from '@angular/core';
import { EncryptionService } from './services/encryption.service';
import { EnviromentsService } from './services/enviroments.service';
import { environment } from "../environments/environment";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-material';
  langs: string[] = [];
  constructor(
    private _enviroments: EnviromentsService,
    private _encryptionService: EncryptionService,
    private translate: TranslateService

  ) {

   // this.setAppLanguage();
    // Set Enviroment
    // this.translate.addLangs(['es', 'en']);
    // this.langs = this.translate.getLangs();
    // this.translate.setDefaultLang('es');
    // this.translate.use('en');
    this._enviroments.initEnvironment(environment);
    this._encryptionService.initServiceEnvironment(environment);

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix Start
     * ----------------------------------------------------------------------------------------------------
     */

    /**
     * If you are using a language other than the default one, i.e. Turkish in this case,
     * you may encounter an issue where some of the components are not actually being
     * translated when your app first initialized.
     *
     * This is related to ngxTranslate module and below there is a temporary fix while we
     * are moving the multi language implementation over to the Angular's core language
     * service.
     **/

    // Set the default language to 'en' and then back to 'tr'.
    // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
    // been selected and there is no way to force it, so we overcome the issue by switching
    // the default language back and forth.
    /**
     setTimeout(() => {
        this._translateService.setDefaultLang('en');
        this._translateService.setDefaultLang('tr');
     });
     */

    /**
     * ----------------------------------------------------------------------------------------------------
     * ngxTranslate Fix End
     * ----------------------------------------------------------------------------------------------------
     */

    // Add is-mobile class to the body if the platform is mobile

  }

 /* setAppLanguage() {
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang());
  }*/
  changeLang(lang: string) {
    this.translate.use(lang);
  }

}
