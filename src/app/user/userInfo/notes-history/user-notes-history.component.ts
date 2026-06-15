import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-user-notes-history',
  templateUrl: './user-notes-history.component.html',
  styleUrls: ['./user-notes-history.component.css']
})
export class UserNotesHistoryComponent implements OnInit {

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
  user_id: any;
  startDate: any = '';
  endDate: any = '';

  constructor(public userService: UserListService, public sharedService: SharedService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
    this.getNotes(this.user_id, this.usersPerPage, this.currentPage);
  }

  // getUsers(usersPerPage: any, currentPage: any, search: any) {
  //   const searchkey: any = ''

  //   const userData = new FormData();

  //   if (currentPage) {
  //     const totalPage = usersPerPage * currentPage;
  //     userData.append('start', totalPage.toString());
  //   }
  //   this.isLoading = true;
  //   userData.append('search_keyword', this.search);
  //   userData.append('type', this.selectedGroupType);

  //   if (this.startDate && this.endDate) {
  //     userData.append('date_range', `${this.startDate}, ${this.endDate}`);
  //   }

  //   this.sharedService.postAPI('/getAllMissedPayments', userData).subscribe({
  //     next: (resp) => {
  //       this.users = resp.lists;
  //       this.totalUsers = resp.listCount;
  //       this.isLoading = false;
  //       this.isLoadingPage = false;
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.isLoadingPage = false;
  //       console.error('Login error:', error.message);
  //     }
  //   });
  // }

  // search start

  getNotes(id: any, usersPerPage: any, currentPage: any) {

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

    this.sharedService.postAPI(`/getUserNotes/${id}`, userData).subscribe(
      (userData: { notes: any[]; totalCount: number }) => {
        this.users = userData.notes;
        this.totalUsers = userData.totalCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  }

  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getNotes(this.user_id, this.usersPerPage, this.currentPage);;
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
    this.getNotes(this.user_id, this.usersPerPage, this.currentPage);
  }

  reset() {
    this.startDate = '';
    this.endDate = '';
    this.selectedGroupType = '';
    this.getNotes(this.user_id, this.usersPerPage, this.currentPage);
  }


}
