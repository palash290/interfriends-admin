import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessagingService } from './messaging.service';




const API_URL = environment.apiUrl;
@Injectable({providedIn: 'root'})

export class AuthService {

  private isUserAuthenticated = false;
  private token: string;
  private userId: string;
  private email: string;
  private admin_type: string;
  private name: string;
  private authUserStatusListner = new Subject<boolean>();

  constructor(
    private http: HttpClient ,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private injector: Injector
    ) {}


    getToken(): any {
      return this.token;
    }

    getIsAuth(): any {
      return this.isUserAuthenticated;
    }

    getUserId(): any {
      return this.userId;
    }

    getEmail(): any {
      return this.email;
    }

    getAdminType(): any {
      return this.admin_type;
    }



    getName(): any {
      return this.name;
    }

    getauthUserStatusListner(): any {
      return this.authUserStatusListner.asObservable();
    }


    login(email: string, password: string): any {
      // localStorage.clear();
      const authData = new FormData();
      authData.append('email', email);
      authData.append('password', password);

      this.http.post<{
        success: string,
        message: string,
        user_id: string,
        email: string,
        admin_type: string,
        token: string,
        name: string
      }>( API_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        console.log("token", token)
        this.token = token;
        if (response.success  === '1' && token) {
          this.isUserAuthenticated = true;
          this.userId = response.user_id;
          this.email = response.email;
          this.admin_type = response.admin_type;
          this.name = response.name;
          this.authUserStatusListner.next(true);
          this.sveAuthData(token, this.userId , this.email, this.name, this.admin_type);
          this.toastr.success(response.message);
          const messagingService = this.injector.get(MessagingService);
           // notification code start
           console.log('notification code',this.userId);
           messagingService.requestPermission(this.userId);
           // notification code end
          this.router.navigate(['/user/dashboard']);
        } else {
          this.authUserStatusListner.next(false);
          this.toastr.error(response.message);
          location.reload();
        }
      }, error => {
        this.authUserStatusListner.next(false);
      });
    }

    forgot_password(email: string): any {
      const authData = new FormData();
      authData.append('email', email);
      return this.http.post<{success: string, message: string}>(
        API_URL + '/forgetPassword', authData
      );
    }


    logout(): any {
      const authData = new FormData();
      authData.append('user_id', this.userId);

      // localStorage.clear();
      this.token = null;
      this.isUserAuthenticated = false;
      this.authUserStatusListner.next(false);
      this.userId = null;
      this.email = null;
      this.admin_type = null;
      this.name = null;
      this.clearAuthData();
      this.router.navigate(['/']);
    }

    autoAuthUser(): any {
      const authInformation = this.getAuthData();
      if (!authInformation) {
          return;
      }

      this.token = authInformation.token;
      this.isUserAuthenticated = true;
      this.userId = authInformation.userId;
      this.email = authInformation.email;
      this.admin_type = authInformation.admin_type;
      this.name = authInformation.name;
      this.authUserStatusListner.next(true);
    }

    public saveName(name: string): any {
      localStorage.setItem('name_interFriendAdmin', name);
      this.name = name;
    }



    private sveAuthData(token: string, userId: string, email: string , name: string, admin_type: string): any {
      localStorage.setItem('token_interFriendAdmin', token);
      localStorage.setItem('userId_interFriendAdmin', userId);
      localStorage.setItem('email_interFriendAdmin', email);
      localStorage.setItem('name_interFriendAdmin', name);
      localStorage.setItem('admin_type_interFriendAdmin', admin_type);
    }

    private clearAuthData(): any {
      localStorage.removeItem('token_interFriendAdmin');
      localStorage.removeItem('userId_interFriendAdmin');
      localStorage.removeItem('email_interFriendAdmin');
      localStorage.removeItem('name_interFriendAdmin');
      localStorage.removeItem('admin_type_interFriendAdmin');
    }

    private getAuthData(): any {
      const token = localStorage.getItem('token_interFriendAdmin');
      const userId = localStorage.getItem('userId_interFriendAdmin');
      const email = localStorage.getItem('email_interFriendAdmin');
      const name = localStorage.getItem('name_interFriendAdmin');
      const admin_type = localStorage.getItem('admin_type_interFriendAdmin');
      if (!token) {
        return;
      }

      return {
        token: token,
        userId: userId,
        email: email,
        name: name,
        admin_type: admin_type
      }
    }

}
