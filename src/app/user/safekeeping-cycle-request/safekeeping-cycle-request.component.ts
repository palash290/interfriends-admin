import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { SafekeepingwithdralService } from 'src/app/service/safekeepingwithdral.service';

@Component({
  selector: 'app-safekeeping-cycle-request',
  templateUrl: './safekeeping-cycle-request.component.html',
  styleUrls: ['./safekeeping-cycle-request.component.css']
})
export class SafekeepingCycleRequestComponent implements OnInit {

  lists: any[] = [];

  listDetail: any;
  totalLists = 0;
  listsPerPage = 10;
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

  constructor(
    public safekeepingwithdralService: SafekeepingwithdralService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public safeKeepingService: SafeKeepingService
  ) { }

  ngOnInit(): void {
    this.group_ids = localStorage.getItem('group_ids');
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

      this.safekeepingwithdralService.getSafekeepingLists(
        this.listsPerPage,
        this.currentPage,
        this.userId,
        this.groupId,
        this.group_ids
      );

      this.listsSub = this.safekeepingwithdralService
        .getListUpdateListenerPayout()
        .subscribe({
          next: (listData: { lists: any[]; listCount: number }) => {
            if (listData.lists) {
              this.lists = listData.lists;
              this.totalLists = listData.listCount;
              this.isLoading = false;
              this.isLoadingPage = false;
              console.log(this.lists, 'listDetail');
            } else {
              this.isLoading = false;
              this.isLoadingPage = false;
            }

          },
          error: (err) => {
            this.isLoading = false;
            this.isLoadingPage = false;
            this.lists = [];
            this.totalLists = 0;
            console.error('Error fetching safekeeping list:', err);

            // Optional: Show user-friendly error notification
            // this.notificationService.showError('Failed to load data');
          }
        });
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
    this.listsPerPage = pageData.pageSize;
    this.safekeepingwithdralService.getLists(
      this.listsPerPage,
      this.currentPage,
      this.userId,
      this.groupId
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

  getAcceptId(detail: any) {
    this.acceptId = detail.id;
    this.acceptGroupId = detail.group_id;
    this.acceptUserId = detail.user_info.user_id;
  }

  getRejectId(detail: any) {
    this.rejectId = detail.id;
    this.rejectGroupId = detail.group_id;
    this.rejectUserId = detail.user_info.user_id;
  }

  onAccept() {
    this.isLoading = true;
    this.safeKeepingService
      .acceptRejectSafekeepingRequest(
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
        this.isLoading = false;
        // setTimeout(function () {
        //   window.location.reload();
        // }, 2000);
      });
  }

  onReject() {
    this.isLoading = true;
    this.safeKeepingService
      .acceptRejectSafekeepingRequest(
        this.rejectId,
        '0',
        this.rejectGroupId,
        this.rejectUserId
      )
      .subscribe((response: any) => {
        this.onClose();
        debugger
        if (response.success == '1') {
          this.toastr.success(response.message);
          this.closeModal1.nativeElement.click();
          this.getList();
        } else {
          this.toastr.error(response.message);
          this.closeModal1.nativeElement.click();
          this.getList();
        }
        this.isLoading = false;
        // setTimeout(function () {
        //   window.location.reload();
        // }, 2000);
      });
  }

  onClose(): void {
    this.form.reset();
    this.display = 'none';
  }

  showMsg() {
    this.toastr.warning("You can't change the status again!")
  }


}
