import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Category } from '../model/category.model';


const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root' })

export class CategoryService {

  private categorys: Category[] = [];
  private categorysUpdated = new Subject<{ categorys: Category[]; categoryCount: number; }>();

  constructor(private http: HttpClient, private router: Router) { }


  getCategorys(categorysPerPage: number, currentPage: number) {

    const categoryData = new FormData();


    if (currentPage) {
      const totalPage = categorysPerPage * currentPage;
      categoryData.append('start', totalPage.toString());
    }


    this.http
      .post<{ success: string; message: string; lists: any; listCount: number; }>(
        API_URL + '/serviceCategoryList', categoryData
      ).subscribe(responseData => {
        this.categorys = responseData.lists;


        this.categorysUpdated.next({
          categorys: [...this.categorys],
          categoryCount: responseData.listCount,
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


  addServiceCategory(
    category_name: string,
    created_by: string,
    created_by_type: string,
  ): any {
    const userData = new FormData();
    userData.append('category_name', category_name);
    userData.append('created_by', created_by);
    userData.append('created_by_type', created_by_type);

    return this.http.post<{
      success: string;
      message: string;
    }>(
      API_URL + '/addServiceCategory', userData
    );
  }


  updateServiceCategory(
    category_id: string,
    category_name: string,
    status: string,
    updated_by: string,
    updated_by_type: string,
  ): any {
    const userData = new FormData();
    userData.append('category_id', category_id);
    userData.append('category_name', category_name);
    userData.append('status', status);
    userData.append('updated_by', updated_by);
    userData.append('updated_by_type', updated_by_type);

    return this.http.post<{
      success: string;
      message: string;
    }>(
      API_URL + '/updateServiceCategory', userData
    );
  }


  getServiceCategoriesDropdown(): any {
    const categoryData = new FormData();

    return this.http.post<any>(
      API_URL + '/serviceCategoryList', categoryData
    );
  }


  getServiceSubCategories(
    start: string,
    category_id: string,
    search: string,
    status: string
  ): any {
    const subCategoryData = new FormData();
    subCategoryData.append('start', start);
    subCategoryData.append('category_id', category_id || '');
    subCategoryData.append('search', search || '');
    subCategoryData.append('status', status || '');

    return this.http.post<any>(
      API_URL + '/serviceSubCategoryList', subCategoryData
    );
  }


  addServiceSubCategory(
    category_id: string,
    subcategory_name: string,
    created_by: string,
    created_by_type: string
  ): any {
    const subCategoryData = new FormData();
    subCategoryData.append('category_id', category_id);
    subCategoryData.append('subcategory_name', subcategory_name);
    subCategoryData.append('created_by', created_by);
    subCategoryData.append('created_by_type', created_by_type);

    return this.http.post<any>(
      API_URL + '/addServiceSubCategory', subCategoryData
    );
  }


  updateServiceSubCategory(
    subcategory_id: string,
    category_id: string,
    subcategory_name: string,
    status: string,
    updated_by: string,
    updated_by_type: string
  ): any {
    const subCategoryData = new FormData();
    subCategoryData.append('subcategory_id', subcategory_id);
    subCategoryData.append('category_id', category_id);
    subCategoryData.append('subcategory_name', subcategory_name);
    subCategoryData.append('status', status);
    subCategoryData.append('updated_by', updated_by);
    subCategoryData.append('updated_by_type', updated_by_type);

    return this.http.post<any>(
      API_URL + '/updateServiceSubCategory', subCategoryData
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
