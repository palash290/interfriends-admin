import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { GroupService } from 'src/app/service/group.service';
import { SharedService } from 'src/app/service/shared.service';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-dividend-management',
  templateUrl: './dividend-management.component.html',
  styleUrls: ['./dividend-management.component.css']
})
export class DividendManagementComponent implements OnInit {

  isLoading = false;
  lists: any[] = [];
  // usersPerPage = 200;
  currentPage = 0;
  search = '';
  totalLists = 0;
  listsPerPage = 10;
  displayDividend = "none";
  subAdminId: any;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public groupService: GroupService,
    private toastr: ToastrService,
    public userListService: UserListService,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.subAdminId = localStorage.getItem('userId_interFriendAdmin');
    this.getDividends(this.listsPerPage, this.currentPage, this.search);
  }

  getDividends(listsPerPage: any, currentPage: any, search_keyword: any) {
    const listData = new FormData();
    this.isLoading = true;
    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('search_keyword', search_keyword);

    this.userListService.postAPI('/dividendList', listData).subscribe(
      (listData: any) => {
        this.lists = listData.lists || [];
        this.totalLists = listData.totalCount ?? listData.listCount ?? listData.totalLists ?? this.lists.length;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error loading dividends:', error);
      });
  }

  dividendPercentages = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5];
  dividendAmount = '';
  dividendDescription = '';
  dividendPercentage = '';

  submitDividend(data: NgForm): void {
    data.control.markAllAsTouched();

    if (data.invalid) {
      return;
    }

    this.isLoading = true;
    const userData = new FormData();
    userData.append('dividend_year', data.value.dividend_year);
    userData.append('percentage', data.value.percentage);
    userData.append('description', data.value.description);
    userData.append('admin_id', this.subAdminId);

    this.sharedService.postAPI('/createDividendForAllUsers', userData).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.toastr.success(resp.message || 'Dividend details captured');
        data.resetForm();
        this.displayDividend = 'none';
        document.getElementById('closeDividendModal').click();
        this.getDividends(this.listsPerPage, this.currentPage, this.search);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error submitting dividend:', error);
        this.toastr.error(error.message || 'Failed to submit dividend.');
      }
    });
  }

  onOpenDividend(): void {
    this.displayDividend = 'block';
  }

  onCLose() {
    this.displayDividend = 'none';
  }

  onChangedPage(pageData: PageEvent): any {
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.getDividends(this.listsPerPage, this.currentPage, '');
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


}
