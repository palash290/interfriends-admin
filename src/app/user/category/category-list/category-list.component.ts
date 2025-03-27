import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../../model/category.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import {CategoryService} from '../../../service/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categorys: Category[] = [];
  totalCategorys = 0;
  categorysPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private categorysSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectCategoryId: string;



  // add edit code start
  categoryId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategorys(this.categorysPerPage, this.currentPage);
    this.categorysSub = this.categoryService.getCategoryUpdateListener().subscribe(
      (categoryData: { categorys: Category[]; categoryCount: number }) => {
      this.categorys = categoryData.categorys;
      this.totalCategorys =  categoryData.categoryCount;
      this.isLoading = false;
      this.isLoadingPage = false;
    });
  }


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.categorysPerPage = pageData.pageSize;
    this.categoryService.getCategorys(this.categorysPerPage, this.currentPage);
  }

  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
  }

  hidePopup(status: string): void {
    if (status === 'add') {
      this.ngOnInit();
    } else {
      this.onReload();
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
  }

  onReload(): any {
    this.categoryService.getCategorys(this.categorysPerPage, this.currentPage);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectCategoryId = id;
  }

  onBlockUnblock(status: string): void {
      this.categoryService.blockUnblock(this.selectCategoryId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.categoryService.getCategorys(this.categorysPerPage, this.currentPage);
        this.toastr.success(response.message);
      });
  }
  // block and unblock code end

  ngOnDestroy(): void {
    this.categorysSub.unsubscribe();
  }


}
