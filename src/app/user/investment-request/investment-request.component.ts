import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestmentRequest } from 'src/app/model/InvestmentRequest.model';
import { InvestmentRequestService } from 'src/app/service/investmentRequest.service';

@Component({
  selector: 'app-investment-request',
  templateUrl: './investment-request.component.html',
  styleUrls: ['./investment-request.component.css']
})
export class InvestmentRequestComponent implements OnInit {

  lists: InvestmentRequest[] = [];
  listDetail: InvestmentRequest;
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
  display: string = "none"
  group_ids: any;
  circle_ids: any;

  constructor(
    public investmentRequestService: InvestmentRequestService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.group_ids = localStorage.getItem('group_ids');
    this.circle_ids = localStorage.getItem('circle_ids');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      // this.investmentRequestService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.group_ids, this.circle_ids);
      // this.listsSub = this.investmentRequestService.getListUpdateListener().subscribe(
      //   (listData: { lists: InvestmentRequest[]; listCount: number }) => {
      //     this.lists = listData.lists;
      //     this.totalLists = listData.listCount;
      //     this.isLoading = false;
      //     this.isLoadingPage = false;
      //     console.log(this.listDetail, 'listDetail');
      //   });
      this.getList();
    });
  }

  getList() {
    this.investmentRequestService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.group_ids, this.circle_ids);
    this.listsSub = this.investmentRequestService.getListUpdateListener().subscribe(
      (listData: { lists: InvestmentRequest[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists = listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
        console.log(this.listDetail, 'listDetail');
      });
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
    this.listsPerPage = pageData.pageSize;
    this.investmentRequestService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.circle_ids);
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
    this.display = 'block';
  }

  onClose() {
    this.display = 'none';
  }



  @ViewChild('closeModal2') closeModal2!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  // acceptId: any;
  acceptGroupId: any;
  acceptUserId: any;
  // rejectId: any;
  // rejectGroupId: any;
  rejectUserId: any;

  description: string = '';
  note_title: string = '';
  note_description: string = '';

  getAcceptId(detail: any) {
    // this.acceptId = detail.id;
    // this.acceptGroupId = detail.group_id;
    this.acceptUserId = detail.id;
    this.description = '';
    this.note_title = '';
    this.note_description = '';
  }

  getRejectId(detail: any) {
    // this.rejectId = detail.id;
    // this.rejectGroupId = detail.group_id;
    this.rejectUserId = detail.id;
  }

  onAccept() {
    this.isLoading = true;
    this.investmentRequestService
      .acceptReject(
        '1',
        this.acceptUserId,
        this.description,
        this.note_title,
        this.note_description
      )
      .subscribe((response: any) => {
        this.onClose();
        if (response.success == '1') {
          this.toastr.success(response.message);
          this.closeModal2.nativeElement.click();
          this.getList();
          this.description = '';
          this.note_title = '';
          this.note_description = '';
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
    this.investmentRequestService
      .acceptReject(
        '2',
        this.rejectUserId,
        // this.rejectGroupId
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

  // onClose(): void {
  //   this.form.reset();
  //   this.display = 'none';
  // }

}
