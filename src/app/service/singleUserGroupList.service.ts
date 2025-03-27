import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { UsergroupList } from '../model/usergroupList.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class SingleUserGroupList {

  private users: UsergroupList[] = [];
  private usersUpdated = new Subject<{ users: UsergroupList[]; userCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getUsers(usersPerPage: number, currentPage: number, groupId: string, group_id_not: string, search: string ) {

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }

    userData.append('group_id', groupId);
    userData.append('group_id_not', group_id_not);
    userData.append('search_keyword', search);

    this.http
      .post<{ success: string; message: string; userList: any;  userCount: number;}>(
        API_URL + '/groupUser_list' , userData
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



  userGroupDetail(
    id: string
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      groupDetail: any
    }>(
        API_URL + '/userGroup_detail', userData
      );
  }


  editUserGroup(
    id: string,
    amount: string,
    expected_date: string,
    jnr_amount: string
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('amount', amount);
    userData.append('expected_date', expected_date);
    userData.append('jnr_amount', jnr_amount);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editUserGroup', userData
      );
  }

}
