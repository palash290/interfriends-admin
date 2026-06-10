import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  constructor(public userService: UserListService, public sharedService: SharedService) { }

  ngOnInit(): void {
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  getUsers(usersPerPage: any, currentPage: any, search: any) {
    const searchkey: any = ''

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
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


}
