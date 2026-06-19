import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-outstanding-payments',
  templateUrl: './outstanding-payments.component.html',
  styleUrls: ['./outstanding-payments.component.css']
})
export class OutstandingPaymentsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  users: any[] = [];
  isLoading = false;
  isLoadingPage = false;
  search = '';

  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  selectedGroupType: any = '';

  startDate: any = '';
  endDate: any = '';
  display: string = "none";

  group_ids: any;
  circle_ids: any;

  constructor(public userService: UserListService, public sharedService: SharedService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.group_ids = localStorage.getItem('group_ids');
    this.circle_ids = localStorage.getItem('circle_ids');
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  getUsers(usersPerPage: any, currentPage: any, search: any) {
    const searchkey: any = ''

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }

    if (this.group_ids) {
      userData.append('group_ids', this.group_ids.toString());
    }

    if (this.circle_ids) {
      userData.append('circle_ids', this.circle_ids.toString());
    }

    this.isLoading = true;
    userData.append('search_keyword', this.search);
    userData.append('type', this.selectedGroupType);

    if (this.startDate && this.endDate) {
      userData.append('date_range', `${this.startDate}, ${this.endDate}`);
    }

    this.sharedService.postAPI('/getAllMissedPayments', userData).subscribe({
      next: (resp) => {
        this.users = resp.lists;
        this.totalUsers = resp.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.isLoadingPage = false;
        console.error('Login error:', error.message);
      }
    });
  }

  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
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
    this.usersPerPage = pageData.pageSize;
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  reset() {
    this.startDate = '';
    this.endDate = '';
    this.selectedGroupType = '';
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  details: any;

  getDetails(details: any) {
    this.details = details;
    // this.display = "block";
  }

  isLoadingBtn: boolean = false;

  sendEmail() {
    this.isLoadingBtn = true;

    const userData = new FormData();

    userData.append('amount', this.details?.amount ?? this.details?.loan_amount);
    userData.append('user_id', this.details?.user_id);
    userData.append('type', this.details?.type);

    if (this.details?.type == 'saving') {
      userData.append('date', this.details?.date);
    } else {
      userData.append('date', this.details?.created_at);
    }

    this.userService
      .postAPI('/sendOutstandingPaymentReminder', userData)
      .subscribe({
        next: (responseData: any) => {
          if (responseData.success == 0) {
            this.toastr.warning(responseData.message);
          } else {
            this.toastr.success(responseData.message);
          }

          this.isLoadingBtn = false;
          this.display = 'none';
          document.getElementById('closeBlock2')?.click();
        },

        error: (error) => {
          this.isLoadingBtn = false;
          this.display = 'none';
          this.toastr.error(
            error?.error?.message || 'Something went wrong. Please try again.'
          );
          // console.error('Send reminder error:', error);
        }
      });
  }

  onClose(): void {
    this.display = "none";
  }


}
