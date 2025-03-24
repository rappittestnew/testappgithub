import {Routes } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout/app-layout.component';
import { AppHomePageComponent } from '@app/app-home-page/app-home-page.component';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { LoginDetailComponent } from '@app/auth/login/login.component';

export const routes: Routes = [ 
  {
     path: '',
     redirectTo: "/home",
     pathMatch: 'full'
  }, 

    {
    path: '',
    component: AppLayoutComponent,
    resolve:{authResolver:AuthenticationResolver},
    children: [
    {
    path: 'home',
    component: AppHomePageComponent,
    },
      {
        path: 'applicationuser',
        loadChildren: () => import('@app/application-user/application-user.module').then(m => m.ApplicationUserModule)
      }
   	]
  }
];