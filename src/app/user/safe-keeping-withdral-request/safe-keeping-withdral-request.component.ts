import { Component, ElementRef, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Safekeepingwithdral } from '../../model/safekeepingwithdral.model';

import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { RecommendUserService } from '../../service/recommendUser.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SafekeepingwithdralService } from 'src/app/service/safekeepingwithdral.service';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-safe-keeping-withdral-request',
  templateUrl: './safe-keeping-withdral-request.component.html',
  styleUrls: ['./safe-keeping-withdral-request.component.css'],
})
export class SafeKeepingWithdralRequestComponent implements OnInit {
  lists: Safekeepingwithdral[] = [];

  listDetail: Safekeepingwithdral;
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

  constructor(
    public safekeepingwithdralService: SafekeepingwithdralService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public safeKeepingService: SafeKeepingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.safekeepingwithdralService.getLists(
        this.listsPerPage,
        this.currentPage,
        this.userId,
        this.groupId
      );
      this.listsSub = this.safekeepingwithdralService
        .getListUpdateListener()
        .subscribe(
          (listData: { lists: Safekeepingwithdral[]; listCount: number }) => {
            this.lists = listData.lists;
            this.totalLists = listData.listCount;
            this.isLoading = false;
            this.isLoadingPage = false;
            console.log(this.lists, 'listDetail');
          }
        );
    });

    this.mode = 'update';
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      note_title: new FormControl(null, { validators: [Validators.required] }),
      note_description: new FormControl(null, {
        validators: [Validators.required],
      }),
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
    // console.log(data, "data")
    // const paymentType : any = 7;
    // this.safeKeepingService.addSafeKeeping(
    //   data.user_id,
    //   data.group_id,
    //   data.amount,
    //   paymentType,
    //   data.reason,
    //   data.reason,
    //   data.id
    // ).subscribe((response: any) => {
    //   console.log(response, "response")
    // /*  document.getElementById('closePopup').click();*/
    //   this.isLoading = false;

    //   if (response.success === '1') {
    //     this.toastr.success(response.message);
    //   } else {
    //     this.toastr.error(response.message);
    //   }
    // },
    // );
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

  onSubmit(form: any) {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const paymentType: any = 7;
    this.safeKeepingService
      .addSafeKeeping(
        this.modalData.user_id,
        this.modalData.group_id,
        this.modalData.amount,
        paymentType,
        this.form.value.note_title,
        this.form.value.note_description,
        this.modalData.id,
        this.modalData.request_type
      )
      .subscribe((response: any) => {
        console.log(response, 'response=====>>>>>>');
        this.onClose();
        if (response.success === '1') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      });
  }

  onClose(): void {
    this.form.reset();
    this.display = 'none';
  }
}
