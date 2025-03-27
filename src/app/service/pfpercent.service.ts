import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
import { Pfpercent } from '../model/pfpercent.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class PfpercentService {

  private lists: Pfpercent[] = [];
  private listsUpdated = new Subject<{ lists: Pfpercent[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/PF_percent_list' , listData
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



  addPF_percent(
    title: string,
    percent: string,
  ): any {
    const userData = new FormData();
    userData.append('title', title);
    userData.append('percent', percent);

    return this.http.post<{
      success: string;
      message: string;
      pf_id: string;
    }>(
        API_URL + '/addPF_percent', userData
      );
  }


  editPF_percent(
    id: string,
    title: string,
    percent: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('title', title);
    userData.append('percent', percent);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editPF_percent', userData
      );
  }


  pf_percent_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('id', id);

    return this.http.post<{
      success: string;
      message: string;
      pf_percentDetail: any;
    }>(
        API_URL + '/pf_percent_detail', userData
      );
  }



  all_pf_percent_list(
  ): any {
    return this.http.get<{
      success: string;
      message: string;
      pfpercentList: any;
    }>(
        API_URL + '/all_pf_percent_list'
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
        API_URL + '/blockUnblockGroup', userData
      );
  }
}
