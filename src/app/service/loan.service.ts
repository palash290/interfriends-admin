import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Loan } from '../model/loan.model';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class LoanService {

  private lists: Loan[] = [];
  private listsUpdated = new Subject<{ lists: Loan[]; listCount: number;}>();
  private listsHelp2Pay: Loan[] = [];
  private listsUpdatedHelp2Pay = new Subject<{ lists: Loan[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}


  getLists(listsPerPage: number, currentPage: number, userId: string, groupId: string, admin_type: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('user_id', userId);
    listData.append('group_id', groupId);
    listData.append('admin_type', admin_type);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/loanList' , listData
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

  getListsHelp2Pay(listsPerPage: number, currentPage: number, userId: string, groupId: string, admin_type: string, loan_type : string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('user_id', userId);
    listData.append('group_id', groupId);
    listData.append('admin_type', admin_type);
    listData.append('loan_type', loan_type);


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/loanList_Help2pay' , listData
      ).subscribe(responseData => {
        this.listsHelp2Pay = responseData.lists;


        this.listsUpdatedHelp2Pay.next({
          lists: [...this.listsHelp2Pay],
          listCount: responseData.listCount,
        });
      });
  }

  getListHelp2PayUpdateListener() {
    return this.listsUpdatedHelp2Pay.asObservable();
  }


  loanPaymentList(
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
      interest_rate: number;
      interest_payable: number;
      loanAmount_initital: number;
      provident:number;
    }>(
        API_URL + '/loanPaymentList', instituteData
      );
  }


  emailMissedPayment(
    user_id: string,
    guarantor: string,
    loanAmount: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('gurarantor_id', guarantor);
    instituteData.append('loan_id', loanAmount);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/sendgrentorMail', instituteData
      );
  }



  addLoanPayment(
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
        API_URL + '/addLoanPayment', instituteData
      );
  }


  loanPaymentDetail(
    id: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      paymentDetail: any;
    }>(
        API_URL + '/loanPaymentDetail', instituteData
      );
  }



  loanDetail(
    id: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      loanDetail: any;
    }>(
        API_URL + '/loanDetail', instituteData
      );
  }




  editLoanPayment(
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
        API_URL + '/editLoanPayment', instituteData
      );
  }


  addLoan(
    user_id: string,
    groupId: string,
    loan_amount: string,
    tenure: string,
    contact_number: string,
    loan_type: string,
    document_image: any,
    pay_date: any,
    created_at: string,
    interRate: string,
    note_title: string,
    note_description: string,
  ): any {
    const instituteData = new FormData();
    let admin_id = this.authService.getUserId();
    instituteData.append('user_id', user_id);
    instituteData.append('admin_id', admin_id);
    instituteData.append('group_id', groupId);
    instituteData.append('loan_amount', loan_amount);
    instituteData.append('tenure', tenure);
    instituteData.append('contact_number', contact_number);
    instituteData.append('loan_type', loan_type);
    instituteData.append('status', '4');
    instituteData.append('document_image', document_image);
    instituteData.append('pay_date', pay_date);
    instituteData.append('created_at', created_at);
    instituteData.append('interRate', interRate);
    instituteData.append('note_title', note_title);
    instituteData.append('note_description', note_description);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/add_loan', instituteData
      );
  }

  editLoan(
    id: string,
    user_id: string,
    groupId: string,
    loan_amount: string,
    tenure: string,
    contact_number: string,
    loan_type: string,
    noteTitle: string,
    noteDescp: string,
    status: string,
    created_at: string
  ): any {
    const instituteData = new FormData();
    let admin_id = this.authService.getUserId();
    instituteData.append('id', id);
    instituteData.append('user_id', user_id);
    instituteData.append('admin_id', admin_id);
    instituteData.append('group_id', groupId);
    instituteData.append('loan_amount', loan_amount);
    instituteData.append('tenure', tenure);
    instituteData.append('contact_number', contact_number);
    instituteData.append('loan_type', loan_type);
    instituteData.append('note_title', noteTitle);
    instituteData.append('note_description', noteDescp);
    instituteData.append('status', status);
    instituteData.append('created_at', created_at);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editLoan', instituteData
      );
  }



  editLoanStatus(
    id: string,
    status: string,
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('status', status);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editLoan', instituteData
      );
  }

  welfareList(
    group_id: string,
    user_id: string,
    groupLifeCycleId : string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', group_id);
    instituteData.append('groupLifecycle_id',groupLifeCycleId);
    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/welfareList', instituteData
      );
  }

  editWelfare(
    id : string,
    user_id: string,
    admin_id :string,
    group_id: string,
    loan_amount: string,
    tenure: string,
    note_title : string,
    note_description : string,
    status : string,
    startDate : string,
    paymentMethod : string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('user_id', user_id);
    instituteData.append('admin_id', admin_id);
    instituteData.append('group_id', group_id);
    instituteData.append('amount', loan_amount);
    instituteData.append('month', tenure);
    instituteData.append('note_title', note_title)
    instituteData.append('note_description', note_description);
    instituteData.append('status', status);
    instituteData.append('created_at', startDate);
    instituteData.append('payment_method',paymentMethod);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editwelfareCycle', instituteData
      );
  }


  requestWelfare(
    user_id: string,
    group_id: string,
    loan_amount: string,
    tenure: string,
    total40month : string,
    provident : string,
    admin_risk : string,
    loan_emi : string,
    startDate : string,
    groupLifeCycleId : string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', group_id);
    instituteData.append('amount', loan_amount);
    instituteData.append('month', tenure);
    instituteData.append('total_payment', total40month)
    instituteData.append('provident', provident)
    instituteData.append('admin_risk', admin_risk)
    instituteData.append('loan_emi', loan_emi)
    instituteData.append('date', startDate)
    instituteData.append('groupLifecycle_id', groupLifeCycleId)

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addWelfareCycle', instituteData
      );
  }



  addSafeKeeping(
    user_id: string,
    admin_id :string,
    group_id: string,
    note : string,
    groupLifeCycleId : string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('admin_id', admin_id);
    instituteData.append('group_id', group_id);
    instituteData.append('note', note)
    instituteData.append('group_cycle_id', groupLifeCycleId)

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addSafeKeeping', instituteData
      );
  }

  addPayoutwelfareCycle(
    user_id: string,
    admin_id :string,
    group_id: string,
    note : string,
    groupLifeCycleId : string
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('admin_id', admin_id);
    instituteData.append('group_id', group_id);
    instituteData.append('note', note)
    instituteData.append('group_cycle_id', groupLifeCycleId)

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addPayoutwelfareCycle', instituteData
      );
  }

  loanStatusHistoryDetail(
    loan_id: string,
  ): any {
    const instituteData = new FormData();
    instituteData.append('loan_id', loan_id);

    return this.http.post<{
      success: string;
      message: string;
      loanDetail: any;
    }>(
        API_URL + '/loanStatusHistoryDetail', instituteData
      );
  }


  emergencyLoanStatusHistoryDetail(
    loan_id: string,
  ): any {
    const instituteData = new FormData();
    instituteData.append('loan_id', loan_id);

    return this.http.post<{
      success: string;
      message: string;
      loanDetail: any;
    }>(
        API_URL + '/emergencyLoanStatusHistoryDetail', instituteData
      );
  }


  all_loan_list(): any {
    return this.http.get<{
      success: string;
      message: string;
      loanList: any;
    }>(
        API_URL + '/all_loan_list',
      );
  }
}
