import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthHomeGuard } from '../auth/auth-home.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';




const routes: Routes = [
  {
    path: '',
    children: [
         {
            path: 'home',
            component: HomePageComponent
         },
         {
          path: '',
          component: LoginComponent,
          canActivate: [AuthHomeGuard]
         }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthHomeGuard
  ]
})
export class HomeRoutingModule { }
