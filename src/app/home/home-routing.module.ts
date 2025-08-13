import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthHomeGuard } from '../auth/auth-home.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';




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
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [AuthHomeGuard]
      },
      {
        path: 'resetPassword/:token',
        component: ResetPasswordComponent,
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
