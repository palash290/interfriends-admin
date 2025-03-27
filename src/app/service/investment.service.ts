import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Investment } from '../model/investment.model';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class InvestmentService {

  private lists: Investment[] = [];
  private listsUpdated = new Subject<{ lists: Investment[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}


  getLists(listsPerPage: number, currentPage: number, user_id: string, group_id: string, payment_status: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('user_id', user_id);
    listData.append('group_id', group_id);
    listData.append('payment_status', payment_status);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/investment_list' , listData
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



  addInvestment(
    user_id: string,
    group_id: string,
    property_id: string,
    amount: string,
    description: string,
    payment_status: string,
    payment_method: string,
    note_title: string,
    note_description: string
  ): any {
    let adminId = this.authService.getUserId();

    const userData = new FormData();
    userData.append('admin_id', adminId);
    userData.append('user_id', user_id);
    userData.append('group_id', group_id);
    userData.append('property_id', property_id);
    userData.append('amount', amount);
    userData.append('description', description);
    userData.append('payment_status', payment_status);
    userData.append('payment_method', payment_method);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addInvestment', userData
      );
  }


  editInvestment(
    id: string,
    user_id: string,
    group_id: string,
    property_id: string,
    amount: string,
    description: string,
    payment_status: string,
    payment_method: string,
    note_title: string,
    note_description: string
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('user_id', user_id);
    userData.append('group_id', group_id);
    userData.append('property_id', property_id);
    userData.append('amount', amount);
    userData.append('description', description);
    userData.append('payment_status', payment_status);
    userData.append('payment_method', payment_method);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editInvestment', userData
      );
  }


  investment_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      investmentDetail: any;
    }>(
        API_URL + '/investment_detail', userData
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
        API_URL + '/blockUnblockProperty', userData
      );
  }
}
