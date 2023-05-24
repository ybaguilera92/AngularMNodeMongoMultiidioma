import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PasswordActivationComponent } from './password-activation.component';


const routes = [
    {
        path: 'auth/recovery-password',
        component: PasswordActivationComponent
    }
];

@NgModule({
    declarations: [
        PasswordActivationComponent
    ],
    exports: [
        PasswordActivationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
    ]
})
export class PasswordActivationModule
{
}
