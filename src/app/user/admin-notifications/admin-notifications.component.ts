import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Loanpercent } from 'src/app/model/loanpercent.model';
import { SafeKeeping } from 'src/app/model/safeKeeping.model';
import { GroupService } from 'src/app/service/group.service';
import { LoanpercentService } from 'src/app/service/loanpercent.service';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  lists: SafeKeeping[] = [];
  users: any[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  totalLists = 0;
  listsPerPage = 10;
  safeKeepingAmount = 0;
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display: string = 'none';
  search = '';

  startDate: any = '';
  endDate: any = '';

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  loanList: any;
  changedStatus: any = '';
  selectedLoanType: any = '';
  selectedGroupType: any = '';
  // add edit code end

  constructor(
    public userService: UserService,
    public safeKeepingService: SafeKeepingService,
    public userListService: UserListService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search)
  }

  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
  };

  getAdminNotifications(listsPerPage: any, currentPage: any, search_keyword: any) {
    const listData = new FormData();

    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('search_keyword', search_keyword);

    listData.append('loan_type', this.selectedLoanType);

    listData.append('group_type_id', this.selectedGroupType);

    listData.append('status', this.changedStatus);

    if (this.startDate && this.endDate) {
      listData.append('date_range', `${this.startDate}, ${this.endDate}`);
    }

    this.userListService.postAPI('/paymentallNotification', listData).subscribe(
      (listData: any) => {
        this.lists = listData.userList;
        this.totalLists = listData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  }

  change() {
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
  }

  reset() {
    this.startDate = '';
    this.endDate = '';
    this.selectedLoanType = '';
    this.changedStatus = '';
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
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

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onReload(): any {
    this.safeKeepingService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  // onBlockUnblock(status: string): void {
  //     this.safeKeepingService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
  //       if (response.status === '1') {
  //         document.getElementById('closeUnblock').click();
  //       } else {
  //         document.getElementById('closeBlock').click();
  //       }
  //       this.safeKeepingService.getLists(this.listsPerPage, this.currentPage);
  //       this.toastr.success(response.message);
  //     });
  // }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.getAdminNotifications(this.listsPerPage, this.currentPage, '');
  }

  openModal() {
    this.display = "block";
  }
  closeModalF(event: any) {
    this.display = event;
  };


  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
  }
}
