import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-sub-admin-logs',
  templateUrl: './sub-admin-logs.component.html',
  styleUrls: ['./sub-admin-logs.component.css']
})
export class SubAdminLogsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  users: any[] = [];
  isLoading = false;
  isLoadingPage = false;
  search = '';

  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  // selectedGroupType: any = '';
  // startDate: any = '';
  // endDate: any = '';
  display: string = "none";

  subAdminId: any;

  constructor(public userService: UserListService, public sharedService: SharedService,
    private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.subAdminId = params['id'];
    });
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  getUsers(usersPerPage: any, currentPage: any, search: any) {
    const userData = new FormData();

    this.isLoading = true;

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }
    userData.append('search_keyword', this.search || '');
    userData.append('subadmin_id', this.subAdminId);

    this.sharedService.postAPI('/getSubAdminLogs', userData).subscribe({
      next: (resp) => {
        this.users = resp.activityLogs ?? resp.lists ?? [];
        this.totalUsers = resp.totalCount ?? resp.listCount ?? this.users.length;
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

  // reset() {
  //   // this.startDate = '';
  //   // this.endDate = '';
  //   // this.selectedGroupType = '';
  //   this.getUsers(this.usersPerPage, this.currentPage, this.search);
  // }

  details: any;

  getDetails(details: any) {
    this.details = details;
    // this.display = "block";
  }

}
