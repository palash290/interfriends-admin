import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Category } from '../model/category.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root'})

export class CategoryService {

  private categorys: Category[] = [];
  private categorysUpdated = new Subject<{ categorys: Category[]; categoryCount: number;}>();

  constructor(private http: HttpClient, private router: Router) {}


  getCategorys(categorysPerPage: number, currentPage: number) {

    const categoryData = new FormData();


    if (currentPage) {
      const totalPage = categorysPerPage * currentPage;
      categoryData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; categoryList: any;  categoryCount: number;}>(
        API_URL + '/category_all_list' , categoryData
      ).subscribe(responseData => {
        this.categorys = responseData.categoryList;


        this.categorysUpdated.next({
          categorys: [...this.categorys],
          categoryCount: responseData.categoryCount,
        });
      });
  }

  getCategoryUpdateListener() {
    return this.categorysUpdated.asObservable();
  }



  addCategory(
    category_name: string,
    image: any,
  ): any {
    const userData = new FormData();
    userData.append('category_name', category_name);
    userData.append('image', image);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/addCategory', userData
      );
  }


  editCategory(
    category_id: string,
    category_name: string,
    image: any,
  ): any {
    const userData = new FormData();
    userData.append('category_id', category_id);
    userData.append('category_name', category_name);
    userData.append('image', image);

    return this.http.post<{
      success: string;
      message: string;
    }>(
        API_URL + '/editCategory', userData
      );
  }


  categoryDetail(
    category_id: string,
  ): any {
    const userData = new FormData();
    userData.append('category_id', category_id);

    return this.http.post<{
      success: string;
      message: string;
      categoryDetail: any;
    }>(
        API_URL + '/category_detail', userData
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
        API_URL + '/blockUnblockCategory', instituteData
      );
  }
}
