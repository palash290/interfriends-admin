import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { Miscellaneous } from '../model/miscellaneous.model';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class MiscellaneousService {

  private lists: Miscellaneous[] = [];
  private listsUpdated = new Subject<{ lists: Miscellaneous[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}


  getLists(listsPerPage: number, currentPage: number, userId: string, groupId: string,) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    let admin_type = this.authService.getAdminType();
    listData.append('user_id', userId);
    listData.append('group_id', groupId);
    listData.append('admin_type', admin_type);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/miscellaneous_list' , listData
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



  addMiscellaneous(
    user_id: string,
    group_id: string,
    amount: string,
    start_date: string,
    status: string,
    title: string,
    description: string,
    tenure: string,
    note_title: string,
    note_description: string
  ): any {
    const userData = new FormData();
    userData.append('user_id', user_id);
    userData.append('group_id', group_id);
    userData.append('amount', amount);
    userData.append('start_date', start_date);
    userData.append('status', status);
    userData.append('title', title);
    userData.append('tenure', tenure);
    userData.append('description', description);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);

    return this.http.post<{
      success: string;
      message: string;
      loan_id: string;
    }>(
        API_URL + '/addMiscellaneous', userData
      );
  }


  editMiscellaneous(
    id: string,
    userId: string,
    groupId: string,
    amount: string,
    status: string,
    note_title: string,
    note_description: string,
    payment_method: string,
    paid_status: string
  ): any {
    const userData = new FormData();
    let admin_id = this.authService.getUserId();
    userData.append('id', id);
    userData.append('user_id', userId);
    userData.append('group_id', groupId);
    userData.append('amount', amount);
    userData.append('status', status);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);
    userData.append('payment_method', payment_method);
    userData.append('paid_status', paid_status);


    userData.append('admin_id', admin_id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editMiscellaneous', userData
      );
  }


  miscellaneous_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      miscellaneousDetail: any;
    }>(
        API_URL + '/miscellaneous_detail', userData
      );
  }


  miscellaneousStatusHistoryDetail(
    miscellaneous_id: string,
  ): any {
    const instituteData = new FormData();
    instituteData.append('miscellaneous_id', miscellaneous_id);

    return this.http.post<{
      success: string;
      message: string;
      miscellaneousDetail: any;
    }>(
        API_URL + '/miscellaneousLoanStatusHistoryDetail', instituteData
      );
  }

  loanMiscellaneousPaymentList(
    user_id: string,
    group_id: string,
    loan_id: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', group_id);
    instituteData.append('loan_id', loan_id);

    return this.http.post<{
      success: string;
      message: string;
      paymentList: any;
      totalPaidAmount: number;
      loanAmount: number;
      loanAmount_initital: number;
    }>(
        API_URL + '/loanMiscellaneousPaymentList', instituteData
      );
  }


  addMiscellaneousPayment(
    user_id: string,
    group_id: string,
    loan_id: string,
    amount: string,
    note_title: string,
    note_description: string,
    payment_method: string,
    status: string,
    created_at: string
  ): any {
    const instituteData = new FormData();
    let adminId = this.authService.getUserId();
    instituteData.append('admin_id', adminId);
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', group_id);
    instituteData.append('loan_id', loan_id);
    instituteData.append('amount', amount);
    instituteData.append('note_title', note_title);
    instituteData.append('note_description', note_description);
    instituteData.append('payment_method', payment_method);
    instituteData.append('status', status);
    instituteData.append('created_at', created_at);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addMiscellaneousPayment', instituteData
      );
  }


  editMiscellaneousPayment(
    id: string,
    userId: string,
    groupId: string,
    amount: string,
    note_title: string,
    note_description: string,
    payment_method: string,
    status: string,
    created_at: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('user_id', userId);
    instituteData.append('group_id', groupId);
    instituteData.append('amount', amount);
    instituteData.append('note_title', note_title);
    instituteData.append('note_description', note_description);
    instituteData.append('payment_method', payment_method);
    instituteData.append('status', status);
    instituteData.append('created_at', created_at);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editMiscellaneousPayment', instituteData
      );
  }


  miscellaneousPaymentDetail(
    id: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      paymentDetail: any;
    }>(
        API_URL + '/miscellaneousPaymentDetail', instituteData
      );
  }

}
