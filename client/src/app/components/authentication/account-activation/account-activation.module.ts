import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AccountActivationComponent} from "./account-activation.component";

const routes = [
    {
        path     : 'auth/activate',
        component: AccountActivationComponent
    }
];

@NgModule({
    declarations: [
        AccountActivationComponent
    ],
    exports: [
        AccountActivationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
    ]
})
export class AccountActivationModule
{
}
