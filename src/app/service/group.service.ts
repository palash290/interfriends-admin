import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Group } from '../model/group.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class GroupService {

  private lists: Group[] = [];
  private listsUpdated = new Subject<{ lists: Group[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/group_list' , listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;


        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
        });
      });
  }

  getListUpdateListener() {
    return this.listsUpdated.asObservable();
  };


  postAPI(url:any, data:any):Observable<any>{
    return this.http.post(API_URL + url ,data )
  };

  getApi(url:any):Observable<any>{
    return this.http.get(API_URL + url )
  };


  addGroup(
    group_cycle_name: string,
    group_cycle_descp: string,
  ): any {
    const userData = new FormData();
    userData.append('group_cycle_name', group_cycle_name);
    userData.append('group_cycle_descp', group_cycle_descp);

    return this.http.post<{
      success: string;
      message: string;
      group_id: string;
    }>(
        API_URL + '/addGroup', userData
      );
  }


  editGroup(
    id: string,
    group_cycle_name: string,
    group_cycle_descp: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('group_cycle_name', group_cycle_name);
    userData.append('group_cycle_descp', group_cycle_descp);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editGroup', userData
      );
  }


  group_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      groupDetail: any;
      members: any
    }>(
        API_URL + '/group_detail', userData
      );
  }


  blockUnblock(
    id: string,
    status: string
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('status', status);

    return this.http.post<{
      success: string;
      message: string;
      status: string
    }>(
        API_URL + '/blockUnblockGroup', userData
      );
  }
}
