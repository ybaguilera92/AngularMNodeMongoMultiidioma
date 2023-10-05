import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EnviromentsService {
    private _environment: any;

    constructor() {}

    initEnvironment(currentEnvironment: any) {
        this._environment = this.overrideCurrentEnviroment(environment, currentEnvironment);
    }

    overrideCurrentEnviroment(libEnviroment:any, currentEnv:any): any {
        Object.keys(currentEnv).forEach(elem => {
            if(libEnviroment.hasOwnProperty(elem) && typeof libEnviroment[elem] == 'object' && libEnviroment[elem] != null){
                this.overrideCurrentEnviroment(libEnviroment[elem], currentEnv[elem]);
            } else {
                libEnviroment[elem] = currentEnv[elem];
            }
        });

        return libEnviroment;
    }

    getEnviroment(): any {
        return this._environment;
    }
   // convertToTitlecase(text:any){
     //   return text.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    //}
}