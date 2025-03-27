import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { InvestmentRequest } from '../model/InvestmentRequest.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class InvestmentRequestService {

  private lists: InvestmentRequest[] = [];
  private listsUpdated = new Subject<{ lists: InvestmentRequest[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }



    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/investment_request_list' , listData
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
