import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { Subadmin } from '../model/subadmin.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class SubadminListService {

  private users: Subadmin[] = [];
  private usersUpdated = new Subject<{ users: Subadmin[]; userCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getUsers(usersPerPage: number, currentPage: number, search: string) {

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }


    userData.append('search_keyword', search);

    this.http
      .post<{ success: string; message: string; userList: any;  userCount: number;}>(
        API_URL + '/subadmin_list' , userData
      ).subscribe(responseData => {
        this.users = responseData.userList;


        this.usersUpdated.next({
          users: [...this.users],
          userCount: responseData.userCount,
        });
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }



  getUserInfo(userId: string): any {
    const authData = new FormData();
    authData.append('id', userId);
    return this.http.post<{
      success: string,
      message: string,
      userInfo: any
    }>(
        API_URL + '/subadminDetailInfo', authData
      );
  }


  blockUnblock(
    id: string,
    status: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('status', status);

    return this.http.post<{
      success: string;
      message: string;
      status: string
    }>(
        API_URL + '/blockUnblockSubadmin', instituteData
      );
  }


  deleteSubAdmin(
    id: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/deleteSubAdmin', instituteData
      );
  }



  addUser(
    name: string,
    email: string,
    phone: string,
  ): any {
    const userData = new FormData();
    userData.append('name',name);
    userData.append('email',email);
    userData.append('phone',phone);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addSubadmin', userData
      );
  }

  editUser(
    id: string,
    name: string,
    email: string,
    phone: string,
  ): any {
    const userData = new FormData();
    userData.append('id',id);
    userData.append('name',name);
    userData.append('email',email);
    userData.append('phone',phone);


    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editSubadmin', userData
      );
  }

}
