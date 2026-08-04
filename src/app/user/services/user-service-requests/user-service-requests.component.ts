import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/service/group.service';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { SafekeepingwithdralService } from 'src/app/service/safekeepingwithdral.service';

@Component({
  selector: 'app-user-service-requests',
  templateUrl: './user-service-requests.component.html',
  styleUrls: ['./user-service-requests.component.css']
})
export class UserServiceRequestsComponent implements OnInit {

  lists: any[] = [];

  listDetail: any;
  totalLists = 0;
  // listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display: string;
  form: FormGroup;
  rejectForm: FormGroup = new FormGroup({
    reason: new FormControl(null, { validators: [Validators.required] }),
  });
  isLoadingUpdate = false;
  mode = 'update';
  adminType: string;
  authService: any;
  closeModal: any;
  mainId: string;
  loan: any;
  modalData: any;
  request_status: string;
  group_ids: any;
  circle_ids: any;
  selectedService: any = null;
  selectedCompanyLogo = '';
  selectedCompanyName = '';
  servicesPerPage = 10;
  selectedServiceImages: Array<{ id: string | number | null; name: string; url: string }> = [];
  subAdminId: any;

  constructor(
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {
     this.subAdminId = localStorage.getItem('userId_interFriendAdmin');
    this.group_ids = localStorage.getItem('group_ids');
    this.circle_ids = localStorage.getItem('circle_ids');
    this.getList();

    this.mode = 'update';
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      note_title: new FormControl(null, { validators: [Validators.required] }),
      note_description: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  private buildExistingImages(service: any): Array<{ id: string | number | null; name: string; url: string }> {
    const candidates = [
      service?.images,
      service?.service_images,
      service?.user_service_images,
      service?.image_list,
      service?.images_data
    ];

    const source = candidates.find((value) => Array.isArray(value)) || [];

    return source
      .map((item: any, index: number) => {
        if (typeof item === 'string') {
          return {
            id: null,
            name: `Image ${index + 1}`,
            url: item
          };
        }

        return {
          id: item?.id ?? item?.image_id ?? item?.user_service_image_id ?? null,
          name: item?.name ?? item?.image_name ?? item?.file_name ?? `Image ${index + 1}`,
          url: item?.url ?? item?.image_url ?? item?.path ?? item?.image ?? ''
        };
      })
      .filter((image: any) => image.url || image.name);
  }

  viewServiceDetails(service: any) {
    this.selectedService = service;
    this.selectedCompanyLogo = this.resolveCompanyLogo(service);
    this.selectedCompanyName = this.resolveCompanyName(service);
    this.selectedServiceImages = this.buildExistingImages(service);
  }

  private resolveCompanyLogo(service: any): string {
    const candidates = [
      service?.company_logo,
      service?.company_logo_thumb,
      service?.company?.logo,
      service?.company?.company_logo,
      service?.company?.company_logo_thumb,
      service?.user_info?.company_logo,
      service?.user_info?.company_logo_thumb,
      service?.user_info?.company?.logo,
      service?.user_info?.company?.company_logo,
      service?.user_info?.company?.company_logo_thumb
    ];

    return candidates.find((value) => !!value) || '';
  }

  private resolveCompanyName(service: any): string {
    const candidates = [
      service?.company_name,
      service?.company?.name,
      service?.company?.company_name,
      service?.user_info?.company_name,
      service?.user_info?.company?.name,
      service?.user_info?.company?.company_name
    ];

    return candidates.find((value) => !!value) || '';
  }

  getList() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');

      const start = (this.servicesPerPage * this.currentPage).toString();

      const serviceData = new FormData();
      serviceData.append('start', start);
      serviceData.append('group_ids', this.group_ids);
      serviceData.append('circle_ids', this.circle_ids);

      this.listsSub = this.groupService
        .postAPI('/getAllUserServices', serviceData)
        .subscribe(
          (listData: { services: any[]; totalCount: number }) => {
            this.lists = listData.services;
            this.totalLists = listData.totalCount;
            this.isLoading = false;
            this.isLoadingPage = false;
            // console.log(this.lists, 'listDetail');
          }
        );
    });
  }


  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  addsafekeepingPayment(data: any) {
    console.log(data);
    this.display = 'block';
    this.modalData = data;

    this.form.patchValue({
      amount: data.amount,
    });
    this.isLoadingUpdate = false;
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.servicesPerPage = pageData.pageSize;
    this.getList();
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
  }


  @ViewChild('closeModal2') closeModal2!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  acceptId: any;
  acceptGroupId: any;
  acceptUserId: any;
  rejectId: any;
  // rejectGroupId: any;
  // rejectUserId: any;

  getAcceptId(detail: any) {
    this.acceptId = detail.user_service_id;
    this.acceptGroupId = detail.group_id;
    this.acceptUserId = detail.user_info.user_id;
  }

  getRejectId(detail: any) {
    this.rejectId = detail.user_service_id;
    // this.rejectGroupId = detail.group_id;
    // this.rejectUserId = detail.user_info.user_id;
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

  onAccept() {
    this.isLoadingBtn = true;
    const info = this.getCreatorInfo();
    const aprBy: any = info.userType == 'admin' ? 1 : info.userId;

    const serviceData = new FormData();
    serviceData.append('user_service_id', this.acceptId);
    serviceData.append('approval_status', '1');
    serviceData.append('approved_by', aprBy);
    serviceData.append('admin_id', this.subAdminId);

    this.groupService.postAPI('/approveRejectUserService', serviceData)
      .subscribe((response: any) => {
        this.onClose();
        if (response.success == '1') {
          this.toastr.success(response.message);
          this.closeModal2.nativeElement.click();
          this.getList();
        } else {
          this.toastr.error(response.message);
          this.closeModal2.nativeElement.click();
          this.getList();
        }
        this.isLoadingBtn = false;
        // setTimeout(function () {
        //   window.location.reload();
        // }, 2000);
      });
  }

  isLoadingBtn = false;
  onReject() {
    this.rejectForm.markAllAsTouched();

    if (this.rejectForm.invalid) {
      return;
    }
    const info = this.getCreatorInfo();

    const aprBy: any = info.userType == 'admin' ? 1 : info.userId;

    const serviceData = new FormData();
    serviceData.append('user_service_id', this.rejectId);
    serviceData.append('approval_status', '2');
    serviceData.append('approved_by', aprBy);
    serviceData.append('reject_reason', this.rejectForm.value.reason);
    serviceData.append('admin_id', this.subAdminId);

    this.isLoadingBtn = true;
    this.groupService.postAPI('/approveRejectUserService', serviceData)
      .subscribe((response: any) => {
        this.onClose();
        if (response.success == '1') {
          this.toastr.success(response.message);
          this.closeModal1.nativeElement.click();
          this.getList();
        } else {
          this.toastr.error(response.message);
          this.getList();
        }
        this.isLoadingBtn = false;
        // setTimeout(function () {
        //   window.location.reload();
        // }, 2000);
      });
  }

  onClose(): void {
    this.form.reset();
    this.rejectForm.reset();
    this.display = 'none';
  }

  showMsg() {
    this.toastr.warning("You can't change the status again!")
  }


}
