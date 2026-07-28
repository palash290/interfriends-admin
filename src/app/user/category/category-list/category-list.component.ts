import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../../model/category.model';
import { PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../../service/category.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/service/group.service';

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
  isLoading = true;
  isLoadingPage = true;
  selectCategoryId: string;
  adminType: any;


  // add edit code start
  categoryId: string;
  updateId: string;
  updateCategoryName: string;
  updateCategoryStatus: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public categoryService: CategoryService,
    public groupService: GroupService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.adminType = localStorage.getItem('admin_type_interFriendAdmin');
    this.loadCategories();
  }

  search = '';

  loadCategories(showLoader = true): void {
    if (showLoader) {
      this.isLoading = true;
      this.isLoadingPage = true;
    }

    const start = (this.categorysPerPage * this.currentPage).toString();

    const categoryData = new FormData();

    categoryData.append('start', start);
    categoryData.append('search', this.search || '');
    if (this.adminType === '2') {
      categoryData.append('created_by_type', 'admin');
    } else {
      categoryData.append('created_by_type', 'subadmin');
    }
    // categoryData.append('created_by_type', );

    this.groupService.postAPI('/serviceCategoryList', categoryData).subscribe((response: any) => {
      this.normalizeSubCategoryResponse(response);
    });
  }

  normalizeSubCategoryResponse(response: any): void {
    this.categorys = response?.lists || response?.subCategoryList || response?.subCategoryLists || [];
    this.totalCategorys =
      response?.listCount ??
      response?.categoryCount ??
      response?.subCategoryListCount ??
      this.categorys.length;
    this.isLoading = false;
    this.isLoadingPage = false;
  }


  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.categorysPerPage = pageData.pageSize;
    this.loadCategories();
  }

  // add edit code start

  onUpdate(category: Category): void {
    this.updateId = category.id;
    this.updateCategoryName = category.category_name;
    this.updateCategoryStatus = category.status;
    this.eachChange = Math.random().toString();
  }

  hidePopup(status: string): void {
    if (status === 'add') {
      this.loadCategories();
    } else {
      this.onReload();
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
  }

  onReload(): any {
    this.loadCategories();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadCategories(false);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectCategoryId = id;
  }

  onBlockUnblock(status: string): void {
    this.categoryService.blockUnblock(this.selectCategoryId, status).subscribe((response: any) => {
      // if (response.status == '1') {
      //   document.getElementById('closeUnblock').click();
      // } else {
      //   document.getElementById('closeBlock').click();
      // }
      // this.loadCategories();
      // this.toastr.success(response.message);
        if (response.success == '1') {

        document.getElementById('closeUnblock').click();

        document.getElementById('closeBlock').click();

        this.loadCategories();
        this.toastr.success(response.message);
      } else {
        this.toastr.warning(response.message);
      }
    });
  }
  // block and unblock code end

  ngOnDestroy(): void { }


}
