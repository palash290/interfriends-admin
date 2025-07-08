import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Safekeepingwithdral } from '../model/safekeepingwithdral.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root' })

export class SafekeepingwithdralService {

  private lists: Safekeepingwithdral[] = [];
  private listsUpdated = new Subject<{ lists: Safekeepingwithdral[]; listCount: number; }>();

  constructor(private http: HttpClient, private router: Router) { }


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string, group_ids?: any) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    if (group_ids) {
      listData.append('group_ids', group_ids.toString());
    }

    this.http
      .post<{ success: string; message: string; lists: any; listCount: number; }>(
        API_URL + '/safe_keeping_withdral_request_list', listData
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
  }


  getPayoutLists(listsPerPage: number, currentPage: number, user_id: string, group_id: any, group_ids?: any) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    if (group_ids) {
      listData.append('group_ids', group_ids.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any; listCount: number; }>(
        API_URL + '/getAllPayoutList', listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;


        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
        });
      });
  }

  getListUpdateListenerPayout() {
    return this.listsUpdated.asObservable();
  }



  getSafekeepingLists(listsPerPage: number, currentPage: number, user_id: string, group_id: any, group_ids?: any) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    if (group_ids) {
      listData.append('group_ids', group_ids.toString());
    }

    this.http
      .post<{ success: string; message: string; lists: any; listCount: number; }>(
        API_URL + '/safekeeping_request_list', listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;
        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
        });
      });
  }


}
