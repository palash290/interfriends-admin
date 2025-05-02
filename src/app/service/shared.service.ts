import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient, private route: Router) { }

  getApi(url: any): Observable<any> {
    // const authToken = localStorage.getItem('lifeMToken')
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${authToken}`
    // })
    return this.http.get(API_URL + url)
  }

  postAPI(url: any, data: any): Observable<any> {
    // const authToken = localStorage.getItem('lifeMToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    return this.http.post(API_URL + url, data)
  }
  
}
