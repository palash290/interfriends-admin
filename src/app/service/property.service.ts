import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Property } from '../model/property.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class PropertyService {

  private lists: Property[] = [];
  private listsUpdated = new Subject<{ lists: Property[]; listCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getLists(listsPerPage: number, currentPage: number) {

    const listData = new FormData();


    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any;  listCount: number;}>(
        API_URL + '/property_list' , listData
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



  addProperty(
    title: string,
    short_description: string,
    long_description: string,
    main_amount: string,
    start_date: string,
    property_tenure: string,
    image: any,
    file: any,
  ): any {
    const userData = new FormData();
    userData.append('title', title);
    userData.append('short_description', short_description);
    userData.append('long_description', long_description);
    userData.append('main_amount', main_amount);
    userData.append('start_date', start_date);
    userData.append('property_tenure', property_tenure);
    userData.append('image', image);
    if(file.length > 0) {
      for  (var i =  0; i <  file.length; i++)  {
        userData.append("background_image[]",  file[i]);
      }
    }

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addProperty', userData
      );
  }


  editProperty(
    id: string,
    title: string,
    short_description: string,
    long_description: string,
    main_amount: string,
    start_date: string,
    property_tenure: string,
    image: any,
    file: any,
  ): any {
    const userData = new FormData();
    userData.append('property_id', id);
    userData.append('title', title);
    userData.append('short_description', short_description);
    userData.append('long_description', long_description);
    userData.append('main_amount', main_amount);
    userData.append('start_date', start_date);
    userData.append('property_tenure', property_tenure);
    userData.append('image', image);
    if(file.length > 0) {
      for  (var i =  0; i <  file.length; i++)  {
        userData.append("background_image[]",  file[i]);
      }
    }

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editProperty', userData
      );
  }


  property_detail(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('property_id', id);

    return this.http.post<{
      success: string;
      message: string;
      propertyDetail: any;
    }>(
        API_URL + '/property_detail', userData
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
        API_URL + '/blockUnblockProperty', userData
      );
  }

  deletePropertyImage(
    id: string,
  ): any {
    const userData = new FormData();
    userData.append('property_image_id', id);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/delete_property_image', userData
      );
  }


}
