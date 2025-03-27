import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class UserService {

  loanHeaderName = new BehaviorSubject<any>('');

constructor(
  private http: HttpClient ,
  private router: Router,
  private authService: AuthService,
  private toastr: ToastrService) {}



  dashbaord(instituteId: string): any {
    const authData = new FormData();
    authData.append('institute_id', instituteId);
    return this.http.post<{
      success: string,
      message: string,
      info: any;
    }>(
        API_URL + '/dashbaord', authData
      );
  }


  getUserDetail(userId: string): any {
    const authData = new FormData();
    authData.append('user_id', userId);
    return this.http.post<{
      success: string,
      message: string,
      userInfo: any
    }>(
        API_URL + '/getUserDetail', authData
      );
  }


  logout(userId: string): any {
    const authData = new FormData();
    authData.append('user_id', userId);
    return this.http.post<{
      success: string,
      message: string
    }>(
        API_URL + '/logout', authData
      );
  }

  updateProfile(
    userId: string,
    name: string,
    email: string,
    phone: string
    ): any {
    const authData = new FormData();
    authData.append('name', name);
    authData.append('email', email);
    authData.append('phone', phone);
    authData.append('user_id', userId);
    return this.http.post<{
      success: string,
      message: string
    }>(
        API_URL + '/updateProfile', authData
      );
  }

  resetForgetPassword(password: string, token: string): any {
    const userData = new FormData();
    userData.append('token', token);
    userData.append('password', password);
    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/resetForgetPassword', userData
      );
  }


  forgot_password(email: string): any {
    const authData = new FormData();
    authData.append('email', email);
    return this.http.post<{
      success: string,
      message: string
    }>(
        API_URL + '/forgetPassword', authData
      );
  }

  resetPassword(
    oldpassword: string,
    password: string,
    userId: string
  ): any {
    const userData = new FormData();
    userData.append('oldpassword', oldpassword);
    userData.append('password', password);
    userData.append('user_id', userId);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/resetPassword', userData
      );
  }

  addPrivacyPolicy(
    info: string,
  ): any {
    const userData = new FormData();
    userData.append('info', info);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addPrivacyPolicy', userData
      );
  }

  getPrivacyPolicyInfo(
    ): any {
      return this.http.get<{
        success: string;
        message: string;
        privacyInfo: string;
      }>(
          API_URL + '/getPrivacyPolicyInfo'
        );
    }



    getTermsInfo(
      ): any {
        return this.http.get<{
          success: string;
          message: string;
          termsInfo: string;
        }>(
            API_URL + '/getTermsInfo'
          );
      }


      addTerms(
        info: string,
      ): any {
        const userData = new FormData();
        userData.append('info', info);

        return this.http.post<{
          success: string;
          message: string;
        }>(
            API_URL + '/addTerms', userData
          );
      }


      getUserInfo(userId: string): any {
        const authData = new FormData();
        authData.append('user_id', userId);
        return this.http.post<{
          success: string,
          message: string,
          userInfo: any
        }>(
            API_URL + '/userDetailInfo', authData
          );
      }


      userSpecDetails(userId: string, groupId : string): any {
        const authData = new FormData();
        authData.append('user_id', userId);
        authData.append('group_id', groupId);
        return this.http.post<{
          success: string,
          message: string,
          userInfo: any
        }>(
            API_URL + '/userTabsTotal', authData
          );
      }

      all_user_list(): any {
        const authData = new FormData();
        authData.append('user_id', '1');
        return this.http.post<{
          success: string,
          message: string,
          userInfo: any
        }>(
            API_URL + '/all_user_list', authData
          );
      }


      chekgroupLifeCycleExist(id: string): any {
        const authData = new FormData();
        authData.append('group_id', id);
        return this.http.post<{
          success: string,
          message: string,
          groupDetail: any,
          showStatus: boolean,
          showMessage: string
        }>(
            API_URL + '/chekgroupLifeCycleExist', authData
          );
      }


      pfList(
        group_id: string,
        user_id: string
      ): any {
        const authData = new FormData();
        authData.append('group_id', group_id);
        authData.append('user_id', user_id);
        return this.http.post<{
          success: string,
          message: string,
          pfList: any,
          pfAmount: string
        }>(
            API_URL + '/pfList', authData
          );
      }


      checkUserAvailableGroup(
        group_id: string
      ): any {
        const authData = new FormData();
        authData.append('group_id', group_id);
        return this.http.post<{
          success: string,
          message: string,
        }>(
            API_URL + '/checkUserAvailableGroup', authData
          );
      }



      userGroupList(
        user_id: string
      ): any {
        const authData = new FormData();
        authData.append('user_id', user_id);
        return this.http.post<{
          success: string,
          message: string,
          lists: any
        }>(
            API_URL + '/userGroupList', authData
          );
      }

      updateWebToken(
        userId: string,
        web_token: string
        ): any {
        const authData = new FormData();
        authData.append('user_id', userId);
        authData.append('web_token', web_token);
        return this.http.post<{
          success: string,
          message: string,
          userinfo: any
        }>(
            API_URL + '/updateProfile', authData
          );
      }


      allPropertyList(): any {
        return this.http.get<{
          success: string,
          message: string,
          propertyList: any
        }>(
            API_URL + '/all_property_list',
          );
      }

      notificationList(
        ofset: number,
        userId: string,
        user_type: string
      ): any {
        const audioData = new FormData();
        audioData.append('start', ofset.toString());
        audioData.append('user_id', userId);
        audioData.append('user_type', user_type);
        return this.http.post<{
          success: string,
          message: string,
          lists: any
        }>(
            API_URL + '/notification_list', audioData
          );
      }


      getNotificationCount(
      ): any {
        const audioData = new FormData();
        let user_id = this.authService.getUserId();
        audioData.append('user_id', user_id);
        return this.http.post<{
          success: string,
          message: string,
          count: number
        }>(
            API_URL + '/get_notification_count', audioData
          );
      }



      getCycleTotalAmount(
        user_id: string,
        groupLifecycle_id: string,
        group_id: string,
      ): any {
        const audioData = new FormData();
        audioData.append('group_id', group_id);
        audioData.append('groupLifecycle_id', groupLifecycle_id);
        audioData.append('user_id', user_id);
        return this.http.post<{
          success: string,
          message: string,
          info: any
        }>(
            API_URL + '/getCycleTotalAmount', audioData
          );
      }



      getCycleTotalAmountPayout(
        user_id: string,
        groupLifecycle_id: string,
        group_id: string,
      ): any {
        const audioData = new FormData();
        audioData.append('group_id', group_id);
        audioData.append('groupLifecycle_id', groupLifecycle_id);
        audioData.append('user_id', user_id);
        return this.http.post<{
          success: string,
          message: string,
          info: any
        }>(
            API_URL + '/getCycleTotalAmountPayout', audioData
          );
      }


      // getHeader(): Observable<any> {
      //   return this.loanHeaderName.asObservable();
      // }

      sendheaderName(val:any){
        this.loanHeaderName.next(val)
      }


}
