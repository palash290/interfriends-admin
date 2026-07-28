import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/service/group.service';
import { UserList } from 'src/app/model/userList.model';
import { AuthService } from 'src/app/service/auth.service';

interface ServiceCategoryOption {
  id: string;
  category_name: string;
}

interface ServiceSubCategoryOption {
  id: string;
  category_id: string;
  subcategory_name: string;
}

interface ServiceRow {
  id: string;
  category_id: string;
  subcategory_id: string;
  service_name: string;
  description: string;
  status: string;
  sno: number;
  category_name?: string;
  subcategory_name?: string;
  provider_description?: string;
  location?: string;
  // latitude?: string;
  // longitude?: string;
}

interface AssignUserOption extends UserList {
  selected: boolean;
}

interface ServiceAssignedUser {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  description: string;
  location: string;
  // latitude: string;
  // longitude: string;
  approval_status: string;
  status: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  services: ServiceRow[] = [];
  categories: ServiceCategoryOption[] = [];
  subCategories: ServiceSubCategoryOption[] = [];

  totalServices = 0;
  servicesPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];

  isLoading = true;
  isLoadingPage = true;
  isLoadingForm = false;
  isLoadingAssignUsers = false;

  form: FormGroup;
  assignForm: FormGroup;
  mode = 'create';
  selectedServiceId = '';
  selectedAssignServiceId = '';
  assignUsers: AssignUserOption[] = [];
  assignSearch = '';
  adminType: string;
  serviceDetail: {
    id?: string;
    category_id?: string;
    subcategory_id?: string;
    service_name?: string;
    description?: string;
    status?: string;
    created_by?: string;
    created_by_type?: string;
    category_name?: string;
    subcategory_name?: string;
    assigned_users?: ServiceAssignedUser[];
  } | null = null;
  isLoadingServiceDetail = false;

  search = '';
  filterCategoryId = '';
  filterSubCategoryId = '';
  filterStatus = '';

  constructor(
    public groupService: GroupService,
    private toastr: ToastrService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.adminType = this.authService.getAdminType();
    this.initForm();
    this.initAssignForm();
    this.loadCategories();
    this.loadServices();
  }

  initForm(): void {
    this.form = new FormGroup({
      category_id: new FormControl('', { validators: [Validators.required] }),
      subcategory_id: new FormControl('', { validators: [Validators.required] }),
      service_name: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl('1', { validators: [Validators.required] })
    });
  }

  initAssignForm(): void {
    this.assignForm = new FormGroup({
      provider_description: new FormControl('', { validators: [Validators.required] }),
      location: new FormControl('', { validators: [Validators.required] }),
      // latitude: new FormControl('', { validators: [Validators.required] }),
      // longitude: new FormControl('', { validators: [Validators.required] })
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

  loadCategories(): void {
    const categoryData = new FormData();

    this.groupService.postAPI('/serviceCategoryList', categoryData).subscribe((response: any) => {
      // this.categories = response?.lists || response?.categoryList || [];

      const serviceArray = response?.lists || response?.categoryList || [];

      // Remove services with status == 0
      this.categories = serviceArray.filter((service: any) => service.status != 0);
    });
  }

  loadSubCategories(
    categoryId: string = this.filterCategoryId,
    selectedSubCategory?: Pick<ServiceRow, 'subcategory_id' | 'subcategory_name' | 'category_id'>
  ): void {
    const info = this.getCreatorInfo();
    const subCategoryData = new FormData();
    subCategoryData.append('start', '0');
    subCategoryData.append('category_id', categoryId || '');
    subCategoryData.append('search', '');
    subCategoryData.append('status', '');

    if (info.userType === 'admin') {
      subCategoryData.append('created_by_type', 'admin');
    } else {
      subCategoryData.append('created_by_type', 'subadmin');
    }

    this.groupService.postAPI('/serviceSubCategoryList', subCategoryData).subscribe((response: any) => {
      // const loadedSubCategories = response?.lists || response?.subCategoryList || response?.subCategoryLists || [];

      const loadedSubCategories = (
        response?.lists || []
      ).filter((subCategory: any) => subCategory.status != 0);

      if (
        selectedSubCategory?.subcategory_id &&
        selectedSubCategory?.subcategory_name &&
        !loadedSubCategories.some(
          (subCategory: ServiceSubCategoryOption) =>
            String(subCategory.id) === String(selectedSubCategory.subcategory_id)
        )
      ) {
        this.subCategories = [
          {
            id: selectedSubCategory.subcategory_id,
            category_id: selectedSubCategory.category_id || categoryId || '',
            subcategory_name: selectedSubCategory.subcategory_name
          },
          ...loadedSubCategories
        ];
        return;
      }

      this.subCategories = loadedSubCategories;
    });
  }

  normalizeServiceResponse(response: any): void {
    this.services = response?.lists || response?.serviceList || response?.serviceLists || [];
    this.totalServices =
      response?.listCount ??
      response?.serviceCount ??
      response?.serviceListCount ??
      this.services.length;
    this.isLoading = false;
    this.isLoadingPage = false;
  }

  loadServices(showLoader = true): void {
    if (showLoader) {
      this.isLoading = true;
      this.isLoadingPage = true;
    }

    const info = this.getCreatorInfo();

    const start = (this.servicesPerPage * this.currentPage).toString();
    const serviceData = new FormData();
    serviceData.append('start', start);
    serviceData.append('status', this.filterStatus || '');
    serviceData.append('category_id', this.filterCategoryId || '');
    serviceData.append('subcategory_id', this.filterSubCategoryId || '');
    serviceData.append('search', this.search || '');

    if (info.userType === 'admin') {
      serviceData.append('created_by_type', 'admin');
    } else {
      serviceData.append('created_by_type', 'subadmin');
    }

    this.groupService.postAPI('/serviceList', serviceData).subscribe((response: any) => {
      this.normalizeServiceResponse(response);
    });
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.servicesPerPage = pageData.pageSize;
    this.loadServices();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadServices(false);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadServices();
  }

  onCategoryChange(categoryId: string): void {
    this.filterCategoryId = categoryId;
    this.filterSubCategoryId = '';
    this.loadSubCategories(categoryId);
    this.onFilterChange();
  }

  onSubCategoryChange(subCategoryId: string): void {
    this.filterSubCategoryId = subCategoryId;
    this.onFilterChange();
  }

  onOpenCreate(): void {
    this.mode = 'create';
    this.selectedServiceId = '';
    this.form.reset({
      category_id: this.filterCategoryId || '',
      subcategory_id: this.filterSubCategoryId || '',
      service_name: '',
      description: '',
      status: '1'
    });

    if (this.filterCategoryId) {
      this.loadSubCategories(this.filterCategoryId);
    } else {
      this.subCategories = [];
    }
  }

  onOpenAssign(row: ServiceRow): void {
    this.selectedAssignServiceId = row.id;
    this.assignSearch = '';
    this.assignForm.reset({
      provider_description: row.provider_description || '',
      location: row.location || '',
      // latitude: row.latitude || '',
      // longitude: row.longitude || ''
    });
    this.assignUsers = [];
    this.isLoadingAssignUsers = true;
    this.loadAvailableUsers();
  }

  onAssignSearchChange(): void {
    this.isLoadingAssignUsers = true;
    this.loadAvailableUsers();
  }

  private loadAvailableUsers(): void {
    const userData = new FormData();
    userData.append('service_id', this.selectedAssignServiceId || '');
    userData.append('search_keyword', this.assignSearch || '');

    this.groupService.postAPI('/serviceAvailableUserList', userData).subscribe((response: any) => {
      const previousSelections = new Map(
        this.assignUsers.map(user => [String(user.user_id), { selected: user.selected }])
      );
      const loadedUsers = response?.userList || response?.users || response?.lists || [];

      this.assignUsers = loadedUsers.map((user: UserList) => ({
        ...user,
        selected: previousSelections.get(String(user.user_id))?.selected || false,
      }));
      this.isLoadingAssignUsers = false;
    });
  }

  onAssignUserToggle(userId: string, checked: boolean): void {
    const user = this.assignUsers.find(item => String(item.user_id) === String(userId));
    if (user) {
      user.selected = checked;
    }
  }

  onAssignSave(): void {
    this.assignForm.markAllAsTouched();

    const selectedUsers = this.assignUsers
      .filter(user => user.selected)
      .map(user => ({
        user_id: Number(user.user_id) || user.user_id
      }));

    if (this.assignForm.invalid) {
      return;
    }

    if (selectedUsers.length === 0) {
      this.toastr.error('Please select at least one user.');
      return;
    }

    const info = this.getCreatorInfo();
    const payload = {
      service_id: Number(this.selectedAssignServiceId) || this.selectedAssignServiceId,
      users: selectedUsers,
      description: this.assignForm.value.provider_description,
      location: this.assignForm.value.location,
      // latitude: this.assignForm.value.latitude,
      // longitude: this.assignForm.value.longitude,
      created_by: Number(info.userId) || info.userId,
      created_by_type: info.userType
    };

    this.isLoadingForm = true;
    this.groupService.postAPI('/assignServiceToUser', payload).subscribe((response: any) => {
      this.isLoadingForm = false;
      if (response?.success === '1') {
        this.toastr.success(response.message);
        this.closeAssignModal();
      } else {
        this.toastr.error(response?.message || 'Unable to assign service');
      }
    });
  }

  closeAssignModal(): void {
    this.assignForm.reset({
      provider_description: '',
      location: '',
      // latitude: '',
      // longitude: ''
    });
    this.assignUsers = [];
    this.selectedAssignServiceId = '';
    this.isLoadingAssignUsers = false;
    const closeButton = document.getElementById('closeAssignPopup');
    if (closeButton) {
      closeButton.click();
    }
  }

  onEdit(row: ServiceRow): void {
    this.mode = 'update';
    this.selectedServiceId = row.id;

    setTimeout(() => {
      this.form.patchValue({
        category_id: row.category_id || '',
        subcategory_id: row.subcategory_id || '',
        service_name: row.service_name || '',
        description: row.description || '',
        status: row.status || '1'
      });
    }, 500)


    this.loadSubCategories(row.category_id, row);
  }

  onCategoryFormChange(categoryId: string): void {
    this.form.patchValue({ subcategory_id: '' });
    this.loadSubCategories(categoryId);
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.isLoadingForm = true;

    const serviceData = new FormData();
    if (this.mode === 'update') {
      serviceData.append('service_id', this.selectedServiceId);
    }
    serviceData.append('category_id', this.form.value.category_id);
    serviceData.append('subcategory_id', this.form.value.subcategory_id);
    serviceData.append('service_name', this.form.value.service_name);
    serviceData.append('description', this.form.value.description);
    serviceData.append('status', this.form.value.status);

    const endpoint = this.mode === 'update' ? '/updateService' : '/addService';

    if (this.mode === 'update') {
      const updater = this.getUpdaterInfo();
      serviceData.append('updated_by', updater.userId);
      serviceData.append('updated_by_type', updater.userType);
    } else {
      const creator = this.getCreatorInfo();
      serviceData.append('created_by', creator.userId);
      serviceData.append('created_by_type', creator.userType);
    }

    this.groupService.postAPI(endpoint, serviceData).subscribe((response: any) => {
      this.isLoadingForm = false;
      if (response?.success === '1') {
        this.toastr.success(response.message);
        this.closeModal();
        this.loadServices();
      } else {
        this.toastr.error(response?.message || 'Unable to add service');
      }
    });
  }

  closeModal(): void {
    this.form.reset({
      category_id: this.filterCategoryId || '',
      subcategory_id: this.filterSubCategoryId || '',
      service_name: '',
      description: '',
      status: '1'
    });
    this.mode = 'create';
    this.selectedServiceId = '';
    const closeButton = document.getElementById('closePopup');
    if (closeButton) {
      closeButton.click();
    }
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.category_name || '';
  }

  getSubCategoryName(subCategoryId: string): string {
    return this.subCategories.find(subCategory => subCategory.id === subCategoryId)?.subcategory_name || '';
  }

  checkAdminType(): boolean {
    return localStorage.getItem('admin_type_interFriendAdmin') === '2';
  }

  viewService(service_id: any): void {
    this.serviceDetail = null;
    this.isLoadingServiceDetail = true;
    const userData = new FormData();
    userData.append('service_id', service_id || '');

    this.groupService.postAPI('/serviceDetail', userData).subscribe((response: any) => {
      this.serviceDetail = response?.details || response?.serviceDetail || response || null;
      this.isLoadingServiceDetail = false;
    });
  }

  removeAssignedUser(user: ServiceAssignedUser): void {
    const confirmed = window.confirm(`Remove ${user.first_name} ${user.last_name} from this service?`);
    if (!confirmed) {
      return;
    }

    const info = this.getCreatorInfo();
    const userData = new FormData();
    userData.append('user_service_id', user.id || '');
    userData.append('removed_by', info.userId);
    userData.append('removed_by_type', info.userType);

    this.groupService.postAPI('/removeAssignedUserFromService', userData).subscribe((response: any) => {
      if (response?.success === '1') {
        this.toastr.success(response.message || 'User removed successfully');
        if (this.serviceDetail?.assigned_users) {
          this.serviceDetail.assigned_users = this.serviceDetail.assigned_users.filter(
            assignedUser => String(assignedUser.id) !== String(user.id)
          );
        }
      } else {
        this.toastr.error(response?.message || 'Unable to remove user');
      }
    });
  }

  closeViewModal(): void {
    this.serviceDetail = null;
    this.isLoadingServiceDetail = false;
    const closeButton = document.getElementById('closeViewPopup');
    if (closeButton) {
      closeButton.click();
    }
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
    this.groupService.blockUnblockServices(this.selectListId, status).subscribe((response: any) => {
      if (response.success == '1') {

        document.getElementById('closeUnblock').click();

        document.getElementById('closeBlock').click();

        this.loadServices();
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
