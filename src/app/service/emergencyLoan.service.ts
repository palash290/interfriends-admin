import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { EmergencyLoan } from '../model/emergencyLoan.model';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class EmergencyLoanService {

  private lists: EmergencyLoan[] = [];
  private listsUpdated = new Subject<{ lists: EmergencyLoan[]; listCount: number;}>();

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
        API_URL + '/emergencyLoan_list' , listData
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



  addEmergencyLoan(
    user_id: string,
    group_id: string,
    loan_amount: string,
    pay_by: string,
    status: string,
    contact_number: string,
    created_at: string,
    note_title: string,
    note_description: string
  ): any {
    const userData = new FormData();
    userData.append('user_id', user_id);
    userData.append('group_id', group_id);
    userData.append('loan_amount', loan_amount);
    userData.append('pay_by', pay_by);
    userData.append('status', status);
    userData.append('contact_number', contact_number);
    userData.append('created_at', created_at);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);

    return this.http.post<{
      success: string;
      message: string;
      loan_id: string;
    }>(
        API_URL + '/addEmergencyLoan', userData
      );
  }


  editEmergencyLoan(
    id: string,
    userId: string,
    groupId: string,
    loan_amount: string,
    pay_by: string,
    status: string,
    note_title: string,
    note_description: string,
    payment_method: string,
    paid_status: string,
    created_at: string
  ): any {
    const userData = new FormData();
    let admin_id = this.authService.getUserId();
    userData.append('id', id);
    userData.append('user_id', userId);
    userData.append('group_id', groupId);
    userData.append('loan_amount', loan_amount);
    userData.append('pay_by', pay_by);
    userData.append('status', status);
    userData.append('note_title', note_title);
    userData.append('note_description', note_description);
    userData.append('payment_method', payment_method);
    userData.append('paid_status', paid_status);
    userData.append('created_at', created_at);


    userData.append('admin_id', admin_id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editEmergencyLoan', userData
      );
  }


  emergencyLoan_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      emergencyLoanDetail: any;
    }>(
        API_URL + '/emergencyLoan_detail', userData
      );
  }

}
