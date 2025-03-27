import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { SafeKeeping } from '../model/safeKeeping.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class SafeKeepingService {

  private lists: SafeKeeping[] = [];
  private listsUpdated = new Subject<{ lists: SafeKeeping[]; listCount: number; safeKeepingAmount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('user_id', user_id);
    listData.append('group_id', group_id);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number; safeKeepingAmount: number;}>(
        API_URL + '/safeKeeping_list' , listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;


        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
          safeKeepingAmount: responseData.safeKeepingAmount
        });
      });
  }

  getListUpdateListener() {
    return this.listsUpdated.asObservable();
  }



  addSafeKeeping(
    user_id: string,
    groupId: string,
    amount: string,
    payment_method: string,
    note_title: string,
    note_description: string,
    safe_keeping_id : string,
    request_type:number
  ): any {
    
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', groupId);
    instituteData.append('amount', amount);
    instituteData.append('payment_method', payment_method);
    instituteData.append('note_title', note_title);
    instituteData.append('note_description', note_description);
    instituteData.append('safe_keeping_id', safe_keeping_id);
    instituteData.append('request_type', request_type.toString());
    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/debit_Safekeeping', instituteData
      );
  }
}
