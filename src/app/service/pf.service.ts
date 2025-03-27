import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Pf } from '../model/pf.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class PfService {

  private lists: Pf[] = [];
  private listsUpdated = new Subject<{ lists: Pf[]; listCount: number; pfAmount: number}>();

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
      .post<{ success: string; message: string; lists: any;  listCount: number; pfAmount: number}>(
        API_URL + '/pf_list' , listData
      ).subscribe(responseData => {
        this.lists = responseData.lists;


        this.listsUpdated.next({
          lists: [...this.lists],
          listCount: responseData.listCount,
          pfAmount: responseData.pfAmount
        });
      });
  }

  getListUpdateListener() {
    return this.listsUpdated.asObservable();
  }


  addPF(
    user_id: string,
    groupId: string,
    amount: string,
    payment_method: string,
    note_title: string,
    note_description: string,
  ): any {
    const instituteData = new FormData();
    instituteData.append('user_id', user_id);
    instituteData.append('group_id', groupId);
    instituteData.append('amount', amount);
    instituteData.append('payment_method', payment_method);
    instituteData.append('note_title', note_title);
    instituteData.append('note_description', note_description);
    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/debit_pf', instituteData
      );
  }
}
