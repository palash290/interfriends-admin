import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Plan } from '../model/plan.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class PlanService {

  private plans: Plan[] = [];
  private plansUpdated = new Subject<{ plans: Plan[]; planCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getPlans(plansPerPage: number, currentPage: number) {

    const planData = new FormData();


    if (currentPage) {
      const totalPage = plansPerPage * currentPage;
      planData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; planList: any;  planCount: number;}>(
        API_URL + '/plan_list' , planData
      ).subscribe(responseData => {
        this.plans = responseData.planList;


        this.plansUpdated.next({
          plans: [...this.plans],
          planCount: responseData.planCount,
        });
      });
  }

  getPlanUpdateListener() {
    return this.plansUpdated.asObservable();
  }



  addPlan(
    title: string,
    description: string,
    price: string,
    days: string,
    plan_type: string
  ): any {
    const userData = new FormData();
    userData.append('title', title);
    userData.append('description', description);
    userData.append('price', price);
    userData.append('days', days);
    userData.append('plan_type', plan_type);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addPlan', userData
      );
  }


  editPlan(
    plan_id: string,
    title: string,
    description: string,
    price: string,
    days: string,
    plan_type: string
  ): any {
    const userData = new FormData();
    userData.append('plan_id', plan_id);
    userData.append('title', title);
    userData.append('description', description);
    userData.append('price', price);
    userData.append('days', days);
    userData.append('plan_type', plan_type);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editPlan', userData
      );
  }


  planDetail(
    plan_id: string,
  ): any {
    const userData = new FormData();
    userData.append('plan_id', plan_id);

    return this.http.post<{
      success: string;
      message: string;
      planDetail: any;
    }>(
        API_URL + '/plan_detail', userData
      );
  }


  blockUnblock(
    id: string,
    status: string
  ): any {
    const instituteData = new FormData();
    instituteData.append('id', id);
    instituteData.append('status', status);

    return this.http.post<{
      success: string;
      message: string;
      status: string
    }>(
        API_URL + '/blockUnblockPlan', instituteData
      );
  }
}
