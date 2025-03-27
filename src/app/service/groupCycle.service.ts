import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GroupCycle } from '../model/groupCycle.model';
import { AuthService } from './auth.service';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class GroupCycleService {

  private lists: GroupCycle[] = [];
  private listsUpdated = new Subject<{ lists: GroupCycle[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}


  getLists(listsPerPage: number, currentPage: number, groupId: string) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('group_id', groupId);

    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/groupCycle_list' , listData
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



  addGroupCycle(
    group_id: string,
    start_date: string,
    month_count: string,
    group_type_id: string
  ): any {
    const userData = new FormData();
    userData.append('group_id', group_id);
    userData.append('start_date', start_date);
    userData.append('month_count', month_count);
    userData.append('group_type_id', group_type_id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addGroupCycle', userData
      );
  }


  editGroupCycle(
    id: string,
    group_id: string,
    start_date: string,
    month_count: string,
    group_type_id: string
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('group_id', group_id);
    userData.append('start_date', start_date);
    userData.append('month_count', month_count);
    userData.append('group_type_id', group_type_id);


    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editGroupCycle', userData
      );
  }


  groupCycle_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      groupDetail: any;
    }>(
        API_URL + '/groupCycle_detail', userData
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
        API_URL + '/blockUnblockGroupCycle', userData
      );
  }



  userSingleCycle(
    group_id: string,
    groupLifecycle_id: string,
    user_id: string
  ): any {
    const userData = new FormData();
    userData.append('group_id', group_id);
    userData.append('groupLifecycle_id', groupLifecycle_id);
    userData.append('user_id', user_id);

    return this.http.post<{
      success: string;
      message: string;
      groupCycleList: any
    }>(
        API_URL + '/getuser_group_by_singlecycle', userData
      );
  }

  editUserGroupCycleStatus(
    id: string,
    status: string
  ): any {
    const userData = new FormData();
    let adminId = this.authService.getUserId();
    userData.append('id', id);
    userData.append('status', status);
    userData.append('admin_id', adminId);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/edituser_groupCycle', userData
      );
  }

  editUserGroupCycle(
    id: string,
    userId: string,
    groupId: string,
    amount: string,
    note: string,
    note_description: string,
    date: string,
    month: string,
    status: string,
    payment_method: string
  ): any {
    const userData = new FormData();
    let adminId = this.authService.getUserId();
    userData.append('id', id);
    userData.append('user_id', userId);
    userData.append('group_id', groupId);
    userData.append('amount', amount);
    userData.append('note', note);
    userData.append('note_description', note_description);
    userData.append('date', date);
    userData.append('month', month);
    userData.append('status', status);
    userData.append('payment_method', payment_method);
    userData.append('admin_id', adminId);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/edituser_groupCycle', userData
      );
  }



  adduserGroupCycle(
    group_id: string,
    groupLifecycle_id	: string,
    user_id: string,
    amount: string,
    note: string,
    note_description: string,
    date: string,
    month: string,
    status: string,
    payment_method: string
  ): any {
    const userData = new FormData();
    userData.append('group_id', group_id);
    userData.append('groupLifecycle_id', groupLifecycle_id);
    userData.append('user_id', user_id);
    userData.append('amount', amount);
    userData.append('note', note);
    userData.append('note_description', note_description);
    userData.append('date', date);
    userData.append('month', month);
    userData.append('status', status);
    userData.append('payment_method', payment_method);


    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/adduser_groupCycle', userData
      );
  }

  userGroupCycle(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      groupDetail: any;
    }>(
        API_URL + '/userCycle_detail', userData
      );
  }


  groupCycleAll_list(
    group_id: string,
    type: string
  ): any {
    const userData = new FormData();
    userData.append('group_id', group_id);
    userData.append('type', type);

    return this.http.post<{
      success: string;
      message: string;
      lists: any;
    }>(
        API_URL + '/groupCycleAll_list_web', userData
      );
  }



  showPayout(
    user_id: string,
    group_cycle_id: string,
    group_id: string,
  ): any {
    const userData = new FormData();
    userData.append('user_id', user_id);
    userData.append('group_cycle_id', group_cycle_id);
    userData.append('group_id', group_id);

    return this.http.post<{
      success: string;
      message: string;
      showButton: boolean;
      showAlertMessage: boolean;
      showAlreadyAlertMessage: boolean;
    }>(
        API_URL + '/showStatus', userData
      );
  }

  showStatus(
    user_id: string,
    group_cycle_id: string,
    group_id: string,
  ): any {
    const userData = new FormData();
    userData.append('user_id', user_id);
    userData.append('group_cycle_id', group_cycle_id);
    userData.append('group_id', group_id);

    return this.http.post<{
      success: string;
      message: string;
      showButton: boolean;
      showAlertMessage: boolean;
      showAlreadyAlertMessage: boolean;
    }>(
        API_URL + '/showStatus', userData
      );
  }



  addPayout(
    user_id: string,
    group_cycle_id: string,
    group_id: string,
    pfNote : any
  ): any {
    const userData = new FormData();
    let admin_id = this.authService.getUserId();
    userData.append('admin_id', admin_id);
    userData.append('user_id', user_id);
    userData.append('group_cycle_id', group_cycle_id);
    userData.append('group_id', group_id);
    userData.append('note', pfNote);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addPayout', userData
      );
  }


  addSafeKeeping(
    user_id: string,
    group_cycle_id: string,
    group_id: string,
    sfNote : any
  ): any {
    const userData = new FormData();
    let admin_id = this.authService.getUserId();
    userData.append('user_id', user_id);
    userData.append('group_cycle_id', group_cycle_id);
    userData.append('group_id', group_id);
    userData.append('admin_id', admin_id);
    userData.append('note', sfNote);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addSafeKeeping', userData
      );
  }


  payoutDetail(
    group_id: string,
    group_cycle_id: string,
    user_id: string,
  ): any {
    const userData = new FormData();
    userData.append('group_id', group_id);
    userData.append('group_cycle_id', group_cycle_id);
    userData.append('user_id', user_id);

    return this.http.post<{
      success: string;
      message: string;
      payoutCycle: any;
    }>(
      API_URL + '/payoutDetail', userData
      );
  }


  userCycleStatusHistoryDetail(
    lifecycle_id: string
  ): any {
    const userData = new FormData();
    userData.append('lifecycle_id', lifecycle_id);

    return this.http.post<{
      success: string;
      message: string;
      cycleDetail: any;
    }>(
      API_URL + '/userCycleStatusHistoryDetail', userData
      );
  }

  welfareStatusHistoryDetail(
    lifecycle_id: string
  ): any {
    const userData = new FormData();
    userData.append('lifecycle_id', lifecycle_id);

    return this.http.post<{
      success: string;
      message: string;
      cycleDetail: any;
    }>(
      API_URL + '/welfareStatusHistoryDetail', userData
      );
  }
}


