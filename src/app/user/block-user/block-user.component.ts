import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserListService } from 'src/app/service/userList.service';
import { UserList } from '../../model/userList.model';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-block-user',
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.css']
})
export class BlockUserComponent implements OnInit {

  users: UserList[] = [];

  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  isLoading = true;

  constructor(
    public userService: UserListService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // const searchkey: any = ''
    this.userService.userBlockRequestList(this.usersPerPage, this.currentPage).subscribe((userData: { userList: UserList[]; userCount: number }) => {
      this.users = userData.userList;
      this.totalUsers = userData.userCount;
    })
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onSetId(id: string, status: string) {
    this.userService.userBlockconfirm(id, status).subscribe((response: any) => {
      this.userService.userBlockRequestList(this.usersPerPage, this.currentPage).subscribe((userData: { userList: UserList[]; userCount: number }) => {
        this.users = userData.userList;
        this.totalUsers = userData.userCount;
      })
      this.toastr.success(response.message);
    })
  }

  onChangedPage(pageData: PageEvent): any {
    // this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.userService.userBlockRequestList(this.usersPerPage, this.currentPage).subscribe((userData: { userList: UserList[]; userCount: number }) => {
      this.users = userData.userList;
      this.totalUsers = userData.userCount;
    })
  }

}
