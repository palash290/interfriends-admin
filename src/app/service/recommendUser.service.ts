import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { RecommendUserList } from '../model/recommendUserList.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class RecommendUserService {

  private lists: RecommendUserList[] = [];
  private listsUpdated = new Subject<{ lists: RecommendUserList[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/recommendUser_list' , listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;

        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
        });
      });
  };

  getListUpdateListener() {
    return this.listsUpdated.asObservable();
  };

  UpdateStatusAccept(data: any): Observable<any> {
    return this.http.post<any>('https://interfriends.uk/interfriendsApp/Api/Admin/recommendUser_status', data);
  }
  viewRecommnedUserForm(data: any): Observable<any> {
    return this.http.post<any>('https://interfriends.uk/interfriendsApp/Api/Admin/userDetailInfo', data);
  }
  
}
