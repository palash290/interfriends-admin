import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { InvestmentRequest } from '../model/InvestmentRequest.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root' })

export class InvestmentRequestService {

  private lists: InvestmentRequest[] = [];
  private listsUpdated = new Subject<{ lists: InvestmentRequest[]; listCount: number; }>();

  constructor(private http: HttpClient, private router: Router) { }


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string, group_ids?: any, circle_ids?: any) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    if (group_ids) {
      listData.append('group_ids', group_ids.toString());
    }

    if (circle_ids) {
      listData.append('circle_ids', circle_ids.toString());
    }

    this.http
      .post<{ success: string; message: string; lists: any; listCount: number; }>(
        API_URL + '/investment_request_list', listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;

        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
        });
      });
  }

  acceptReject(
    request_status: string,
    user_id: string,
    description?: string,
    note_title?: string,
    note_description?: string
  ): any {

    const instituteData = new FormData();
    instituteData.append('status', request_status);
    instituteData.append('admin_id', '1');
    instituteData.append('request_id', user_id);
    // if (description) {
    //   instituteData.append('description', description);
    // }
    if (note_title) {
      instituteData.append('note_title', note_title);
    }
    if (note_description) {
      instituteData.append('note_description', note_description);
    }
    // instituteData.append('grpId', grpId)
    return this.http.post<{
      success: string;
      message: string;
    }>(
      API_URL + '/updateInvestmentRequestStatus', instituteData
    );
  }

  getListUpdateListener() {
    return this.listsUpdated.asObservable();
  }
}
