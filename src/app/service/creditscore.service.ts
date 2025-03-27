import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Group } from '../model/group.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class creditscoreService {


  constructor(private http: HttpClient, private router: Router) {}

addCreditScore( score1 : any,score2 : any,credit_score_name : any,credit_score_description : any){
    const userData = new FormData();
    userData.append('score1', score1);
    userData.append('score2', score2);
    userData.append('credit_score_name', credit_score_name);
    userData.append('credit_score_description', credit_score_description);


    return this.http.post<{
      success: string;
      message: string;
      credit_score_list : any
    }>(
        API_URL + '/addCreditScoreList', userData
      );
}

  getCreditScore(){

    return this.http.get<{
        success: string;
        message: string;
        credit_score_list: any;
      }>(
          API_URL + '/allCreditScoreList',
        );
  }

  updateCreditScore(id : any, score1 : any,score2 : any,credit_score_name : any,credit_score_description : any){
    
    const userData = new FormData();
    userData.append('id', id);
    userData.append('score1', score1);
    userData.append('score2', score2);
    userData.append('credit_score_name', credit_score_name);
    userData.append('credit_score_description', credit_score_description);


    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editCreditScoreList', userData
      );
  }

  deleteCreditScore(id : any){
    const userData = new FormData();
    userData.append('id', id);
   


    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/deleteCreditScoreList', userData
      );
  }
}
