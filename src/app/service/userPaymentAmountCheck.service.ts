import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Pf } from '../model/pf.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class UserPaymentAmountCheckService {
    amountCheck = new Subject(); 


  constructor(private http: HttpClient, private router: Router) {}


}
