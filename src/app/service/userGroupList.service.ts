import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { UserList } from '../model/userList.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class UserGroupService {

  private users: UserList[] = [];
  private usersUpdated = new Subject<{ users: UserList[]; userCount: number;}>();
  constructor(private http: HttpClient, private router: Router) {}


  getUsers(usersPerPage: number, currentPage: number, groupId: string, group_id_not: string,search: string) {

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }

    userData.append('search_keyword', search);
    userData.append('group_id', groupId);
    userData.append('group_id_not', group_id_not);

    this.http
      .post<{ success: string; message: string; userList: any;  userCount: number;}>(
        API_URL + '/user_list' , userData
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
        API_URL + '/blockUnblockUser', instituteData
      );
  }



  addUser(
    groupId: string,
    first_name: string,
    last_name: string,
    email: string,
    dob: string,
    mobile_number: string,
    home_number: string,
    emergency_number: string,
    kin_name: string,
    kin_number: string,
    address_line_1: string,
    address_line_2: string,
    post_code: string,
    city: string,
    image: string,
  ): any {
    const userData = new FormData();
    userData.append('group_id',groupId);
    userData.append('first_name',first_name);
    userData.append('last_name',last_name);
    userData.append('email',email);
    userData.append('dob',dob);
    userData.append('mobile_number',mobile_number);
    userData.append('home_number',home_number);
    userData.append('emergency_number',emergency_number);
    userData.append('kin_name',kin_name);
    userData.append('kin_number',kin_number);
    userData.append('address_line_1',address_line_1);
    userData.append('address_line_2',address_line_2);
    userData.append('post_code',post_code);
    userData.append('city',city);
    userData.append('image',image);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addUser', userData
      );
  }

  editUser(
    groupId: string,
    user_id: string,
    first_name: string,
    last_name: string,
    email: string,
    dob: string,
    mobile_number: string,
    home_number: string,
    emergency_number: string,
    kin_name: string,
    kin_number: string,
    address_line_1: string,
    address_line_2: string,
    post_code: string,
    city: string,
    image: string,
  ): any {
    const userData = new FormData();
    userData.append('group_id',groupId);
    userData.append('user_id',user_id);
    userData.append('first_name',first_name);
    userData.append('last_name',last_name);
    userData.append('email',email);
    userData.append('dob',dob);
    userData.append('mobile_number',mobile_number);
    userData.append('home_number',home_number);
    userData.append('emergency_number',emergency_number);
    userData.append('kin_name',kin_name);
    userData.append('kin_number',kin_number);
    userData.append('address_line_1',address_line_1);
    userData.append('address_line_2',address_line_2);
    userData.append('post_code',post_code);
    userData.append('city',city);
    userData.append('image',image);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editUser', userData
      );
  }

  adduserGroup(
    id: string,
    users: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('users', users);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/adduserGroup', instituteData
      );
  }

}
