import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/model/category.model';
import { AuthService } from 'src/app/service/auth.service';
import { CategoryService } from 'src/app/service/category.service';
import { GroupService } from 'src/app/service/group.service';

interface SubCategoryRow {
  id: string;
  category_id: string;
  category_name: string;
  subcategory_name: string;
  status: string;
  sno: number;
}

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  subCategories: SubCategoryRow[] = [];
  categories: Category[] = [];
  totalSubCategories = 0;
  subCategoriesPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = true;
  isLoadingPage = true;
  isLoadingForm = false;
  form: FormGroup;
  mode = 'create';
  selectedSubCategoryId = '';

  search = '';
  filterCategoryId = '';
  filterStatus = '';
  adminType: string;
  subAdminId: any;

  constructor(
    public categoryService: CategoryService,
    public groupService: GroupService,
    private toastr: ToastrService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
     this.subAdminId = localStorage.getItem('userId_interFriendAdmin');
    this.adminType = this.authService.getAdminType();
    this.initForm();
    this.loadCategories();
    this.loadSubCategories();
  }

  initForm() {
    this.form = new FormGroup({
      category_id: new FormControl('', { validators: [Validators.required] }),
      subcategory_name: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl('1', { validators: [Validators.required] })
    });
  }

  private getCreatorInfo(): { userId: string; userType: string } {
    const adminType = localStorage.getItem('admin_type_interFriendAdmin');
    const userId = localStorage.getItem('userId_interFriendAdmin');

    if (adminType === '1') {
      return {
        userId: userId || '',
        userType: 'subadmin'
      };
    }

    return {
      userId: '1',
      userType: 'admin'
    };
  }

  loadCategories(): void {
    const categoryData = new FormData();

    this.groupService.postAPI('/serviceCategoryList', categoryData).subscribe((response: any) => {
      // this.categories = response?.lists || response?.categoryList || [];

      const serviceArray = response?.lists || response?.categoryList || [];

      // Remove services with status == 0
      this.categories = serviceArray.filter((service: any) => service.status != 0);

    });
  }

  normalizeSubCategoryResponse(response: any): void {
    this.subCategories = response?.lists || response?.subCategoryList || response?.subCategoryLists || [];
    this.totalSubCategories =
      response?.listCount ??
      response?.subCategoryCount ??
      response?.subCategoryListCount ??
      this.subCategories.length;
    this.isLoading = false;
    this.isLoadingPage = false;
  }

  loadSubCategories(showLoader = true): void {
    if (showLoader) {
      this.isLoading = true;
      this.isLoadingPage = true;
    }

    const info = this.getCreatorInfo();

    const start = (this.subCategoriesPerPage * this.currentPage).toString();

    const subCategoryData = new FormData();
    subCategoryData.append('start', start);
    subCategoryData.append('category_id', this.filterCategoryId || '');
    subCategoryData.append('search', this.search || '');
    subCategoryData.append('status', this.filterStatus || '');

    if (info.userType === 'admin') {
      subCategoryData.append('created_by_type', 'admin');
    } else {
      subCategoryData.append('created_by_type', 'subadmin');
    }

    this.groupService.postAPI('/serviceSubCategoryList', subCategoryData).subscribe((response: any) => {
      this.normalizeSubCategoryResponse(response);
    });
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.subCategoriesPerPage = pageData.pageSize;
    this.loadSubCategories();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadSubCategories(false);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadSubCategories();
  }

  onOpenCreate(): void {
    this.mode = 'create';
    this.selectedSubCategoryId = '';
    this.form.reset({
      category_id: this.filterCategoryId || '',
      subcategory_name: '',
      status: '1'
    });
  }

  onEdit(row: SubCategoryRow): void {
    this.mode = 'update';
    this.selectedSubCategoryId = row.id;
    this.form.reset({
      category_id: row.category_id || '',
      subcategory_name: row.subcategory_name || '',
      status: row.status || '1'
    });
  }

  private getUpdaterInfo(): { userId: string; userType: string } {
    const adminType = localStorage.getItem('admin_type_interFriendAdmin');
    const userId = localStorage.getItem('userId_interFriendAdmin');

    if (adminType === '1') {
      return {
        userId: userId || '',
        userType: 'subadmin'
      };
    }

    return {
      userId: '1',
      userType: 'admin'
    };
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const creator = this.getCreatorInfo();
    const updater = this.getUpdaterInfo();
    this.isLoadingForm = true;

    if (this.mode === 'create') {
      this.categoryService.addServiceSubCategory(
        this.form.value.category_id,
        this.form.value.subcategory_name,
        creator.userId,
        creator.userType,
        this.subAdminId
      ).subscribe((response: any) => {
        this.isLoadingForm = false;
        if (response?.success === '1') {
          this.toastr.success(response.message);
          this.closeModal();
          this.loadSubCategories();
        } else {
          this.toastr.error(response?.message || 'Unable to add sub category');
        }
      });
      return;
    }

    this.categoryService.updateServiceSubCategory(
      this.selectedSubCategoryId,
      this.form.value.category_id,
      this.form.value.subcategory_name,
      this.form.value.status,
      updater.userId,
      updater.userType,
      this.subAdminId
    ).subscribe((response: any) => {
      this.isLoadingForm = false;
      if (response?.success === '1') {
        this.toastr.success(response.message);
        this.closeModal();
        this.loadSubCategories();
      } else {
        this.toastr.error(response?.message || 'Unable to update sub category');
      }
    });
  }

  closeModal(): void {
    this.form.reset({
      category_id: this.filterCategoryId || '',
      subcategory_name: '',
      status: '1'
    });
    const closeButton = document.getElementById('closePopup');
    if (closeButton) {
      closeButton.click();
    }
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.category_name || '';
  }




  selectListId: string;
  displayBlock: string = "none"
  displayUnblock: string = "none"

  onSetId(id: string): void {
    this.selectListId = id;
    this.displayBlock = "block";
  }

  onSetUnBlockId(id: string): void {
    this.selectListId = id;
    this.displayUnblock = "block";
  }

  onBlockUnblock(status: string): void {
    this.groupService.blockUnblockSubCatServices(this.selectListId, status).subscribe((response: any) => {
      if (response.success == '1') {

        document.getElementById('closeUnblock').click();

        document.getElementById('closeBlock').click();

        this.loadSubCategories();
        this.toastr.success(response.message);
      } else {
        this.toastr.warning(response.message);
      }

    });
  }

  onClose(): void {
    this.displayBlock = "none";
  }

}
