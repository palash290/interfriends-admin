import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { GroupCycleStatus } from '../model/groupCycleStatus.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class UserCycleStatusHistoryService {

  private lists: GroupCycleStatus[] = [];
  private listsUpdated = new Subject<{ lists: GroupCycleStatus[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number, loan_id: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('loan_id', loan_id);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/loanStatusHistory_detail' , listData
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
}
