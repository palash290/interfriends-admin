import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { SafekeepingwithdralService } from 'src/app/service/safekeepingwithdral.service';

@Component({
  selector: 'app-welfare-requests',
  templateUrl: './welfare-requests.component.html',
  styleUrls: ['./welfare-requests.component.css']
})
export class WelfareRequestsComponent implements OnInit {

  lists: any[] = [];

  listDetail: any;
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: any;
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
  search = '';

  constructor(
    public safekeepingwithdralService: SafekeepingwithdralService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public safeKeepingService: SafeKeepingService
  ) { }

  ngOnInit(): void {
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

  getList() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.safekeepingwithdralService.getWelfareLists(
        this.listsPerPage,
        this.currentPage,
        this.userId,
        this.groupId,
        this.search,
        this.group_ids,
        this.circle_ids
      );
      this.listsSub = this.safekeepingwithdralService
        .getListUpdateListenerWelfare()
        .subscribe(
          (listData: { lists: any[]; listCount: number }) => {
            this.lists = listData.lists;
            this.totalLists = listData.listCount;
            this.isLoading = false;
            this.isLoadingPage = false;
            console.log(this.lists, 'listDetail');
          }
        );
    });
  }

  keyPress(): any {
    this.currentPage = 0;
    this.isLoadingPage = true;
    this.safekeepingwithdralService.getWelfareLists(
      this.listsPerPage,
      this.currentPage,
      this.userId,
      this.groupId,
      this.search,
      this.group_ids,
      this.circle_ids
    );
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  private getResolvedUserInfo(detail: any) {
    return detail?.user_info ?? detail ?? {};
  }

  getDisplayName(detail: any): string {
    const userInfo = this.getResolvedUserInfo(detail);
    const firstName = userInfo.first_name ?? detail?.first_name ?? '';
    const lastName = userInfo.last_name ?? detail?.last_name ?? '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return fullName || detail?.name || '-';
  }

  getDisplayEmail(detail: any): string {
    const userInfo = this.getResolvedUserInfo(detail);
    return userInfo.email ?? detail?.user_email ?? detail?.email ?? '-';
  }

  getDisplayUserId(detail: any): string {
    const userInfo = this.getResolvedUserInfo(detail);
    return String(userInfo.user_id ?? detail?.user_id ?? '');
  }

  getPayoutAmount(detail: any): number {
    return Number(detail?.payout_amount ?? detail?.welfare_payout_amount ?? 0);
  }

  getTotalAmount(detail: any): number {
    return Number(
      detail?.payout_amount_total ??
      detail?.welfare_balance ??
      detail?.payout_amount ??
      detail?.welfare_payout_amount ??
      0
    );
  }

  isPendingRequest(detail: any): boolean {
    if (detail?.reviewed_at || detail?.reviewed_by || detail?.reject_reason) {
      return false;
    }

    const rawStatus = String(detail?.status ?? detail?.request_status ?? '');

    return rawStatus === '0' || rawStatus === '2' || rawStatus === '';
  }

  isRejectedRequest(detail: any): boolean {
    const rawStatus = String(detail?.status ?? detail?.request_status ?? '');

    if (detail?.reject_reason) {
      return true;
    }

    return rawStatus === '3';
  }

  isAcceptedRequest(detail: any): boolean {
    const rawStatus = String(detail?.status ?? detail?.request_status ?? '');

    if (detail?.reviewed_at && !detail?.reject_reason) {
      return true;
    }

    return rawStatus === '1';
  }

  getStatusLabel(detail: any): string {
    if (this.isAcceptedRequest(detail)) {
      return 'Accepted';
    }

    if (this.isRejectedRequest(detail)) {
      return 'Rejected';
    }

    return 'Pending';
  }

  getStatusClass(detail: any): string {
    if (this.isAcceptedRequest(detail)) {
      return 'btn-success';
    }

    if (this.isRejectedRequest(detail)) {
      return 'btn-danger';
    }

    return 'btn-warning';
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
    this.listsPerPage = pageData.pageSize;
    this.safekeepingwithdralService.getWelfareLists(
      this.listsPerPage,
      this.currentPage,
      this.userId,
      this.groupId,
      this.search,
      this.group_ids,
      this.circle_ids
    );
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
  rejectGroupId: any;
  rejectUserId: any;
  isLoadingBtn = false;

  getAcceptId(detail: any) {
    this.acceptId = detail.id;
    this.acceptGroupId = detail.group_id;
    this.acceptUserId = this.getDisplayUserId(detail);
  }

  getRejectId(detail: any) {
    this.rejectId = detail.id;
    this.rejectGroupId = detail.group_id;
    this.rejectUserId = this.getDisplayUserId(detail);
  }

  onAccept() {
    debugger
    this.isLoadingBtn = true;
    this.safeKeepingService
      .acceptRejectWalfare(
        this.acceptId,
        '1',
        this.acceptGroupId,
        this.acceptUserId
      )
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

  onReject() {
    this.isLoadingBtn = true;
    this.rejectForm.markAllAsTouched();

    if (this.rejectForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.safeKeepingService
      .acceptRejectWalfare(
        this.rejectId,
        '2',
        this.rejectGroupId,
        this.rejectUserId,
        this.rejectForm.value.reason
      )
      .subscribe((response: any) => {
        this.onClose();
        // debugger
        this.isLoadingBtn = false;
        if (response.success == '1') {
          this.toastr.success(response.message);
          this.closeModal1.nativeElement.click();
          this.getList();
        } else {
          this.toastr.error(response.message);
          this.closeModal1.nativeElement.click();
          this.getList();
        }
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

  selectedWelfare: any;

  viewServiceDetails(service: any) {
    this.selectedWelfare = service;
  }


}
