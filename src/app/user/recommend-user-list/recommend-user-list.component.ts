import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecommendUserList } from '../../model/recommendUserList.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { RecommendUserService } from '../../service/recommendUser.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recommend-user-list',
  templateUrl: './recommend-user-list.component.html',
  styleUrls: ['./recommend-user-list.component.css']
})
export class RecommendUserListComponent implements OnInit {

  @ViewChild('closeBlock2') closeModal2: ElementRef;
  lists: RecommendUserList[] = [];
  recommendUser: any;
  listDetail: RecommendUserList;
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingBtn = false;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display: string = 'none';
  display1: string = 'none';
  selectedUserID: any;
  search = '';

  constructor(
    public recommendUserService: RecommendUserService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.recommendUserService.getLists(this.listsPerPage, this.currentPage, this.search, this.userId, this.groupId);
    });
    this.getLists();
  }

  keyPress(): any {
    // if (this.users.length > 0) {
    //   this.paginator.pageIndex = 0;
    // }
    this.currentPage = 0;
    this.recommendUserService.getLists(this.listsPerPage, this.currentPage, this.search, this.userId, this.groupId);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  };

  getLists() {
    this.recommendUserService.getListUpdateListener().subscribe(
      (listData: { lists: RecommendUserList[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists = listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  };

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.recommendUserService.getLists(this.listsPerPage, this.currentPage, this.search, this.userId, this.groupId);
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
    this.display = "block";
  }

  btn_status: any;

  onUpdateUserStatus(id: string, index: number, userId: number, admin_status: any) {
    this.btn_status = admin_status;
    const formData = new FormData();
    formData.append('user_id', userId.toString())
    this.recommendUserService.viewRecommnedUserForm(formData).subscribe(
      {
        next: resp => {
          this.recommendUser = resp.userinfo;
          // this.recommendUserService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
          // if (resp.success == 1) {
          //   this.onClose2()
          //   this.toastr.success(resp.message);
          // } else {
          //   this.toastr.warning(resp.message);
          // }
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
        }
      }
    );
    this.selectListId = id;
    this.listDetail = this.lists[index];
    this.display1 = "block";
  }

  trackingData: any;
  isTrackingLoading = false;

  getTracking(id: string) {
    // this.btn_status = admin_status;
    this.trackingData = [];
    this.isTrackingLoading = true;
    const formData = new FormData();
    formData.append('id', id.toString())
    this.recommendUserService.viewRecommnedTracking(formData).subscribe(
      {
        next: resp => {
          this.trackingData = resp?.lists?.approval_steps || [];
          this.isTrackingLoading = false;
        },
        error: error => {
          this.isTrackingLoading = false;
          this.toastr.warning('Something went wrong.');
        }
      }
    );
    // this.selectListId = id;
    // this.listDetail = this.lists[index];
    // this.display1 = "block";
  }

  onClose() {
    this.display = 'none';
    this.trackingData = [];
  };

  formatApproverRole(role: string): string {
    return role ? role.replace(/_/g, ' ') : '';
  }

  getApprovalStatusClass(statusCode: string): string {
    if (statusCode === '1') {
      return 'ct_tracking_approved';
    }

    if (statusCode === '2') {
      return 'ct_tracking_rejected';
    }

    return 'ct_tracking_pending';
  }

  onClose2() {
    this.display1 = 'none';
  };

  userAccptReject(value: string) {
    this.isLoadingBtn = true;
    const formData = new FormData();
    formData.append('id', this.selectListId)
    if (value == 'accept') {
      var admin_status = "1"
      formData.append('admin_status', admin_status)
    } else {
      var admin_status = "2"
      formData.append('admin_status', admin_status)
    }
    this.recommendUserService.UpdateStatusAccept(formData).subscribe(
      {
        next: resp => {
          this.recommendUserService.getLists(this.listsPerPage, this.currentPage, this.search, this.userId, this.groupId);
          if (resp.success == 1) {
            this.toastr.success(resp.message);
            this.closeModal2.nativeElement.click();
            document.getElementById('closePopup').click();
            this.isLoadingBtn = false;
          } else {
            this.toastr.success(resp.message);
            this.isLoadingBtn = false;
          }
        },
        error: error => {
          this.isLoadingBtn = false;
          this.toastr.warning('Something went wrong.');
        }
      }
    );
  }

  userImg1: any;

  showImg(url: any) {
    this.userImg1 = url;
  }


}
