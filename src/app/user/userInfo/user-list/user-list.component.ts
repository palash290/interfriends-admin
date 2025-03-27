import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {UserListService} from '../../../service/userList.service';
import { UserList } from '../../../model/userList.model';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static : false} ) paginator: MatPaginator;
  users: UserList[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectPlanId: string;
  adminType: string;
  search = '';


 // view detail
  updateId: string;
  eachChange: string;
  add: string;
  display = "none";
  display1 = 'none';
  display2 = 'none'
  display4 = 'none'

  constructor(
    public userService: UserListService,
    public authService: AuthService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.adminType = this.authService.getAdminType();
      this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
      this.usersSub = this.userService.getUserUpdateListener().subscribe(
        (userData: { users: UserList[]; userCount: number }) => {
        this.users = userData.users;
        this.totalUsers =  userData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }


   // add edit code start

   onUpdate(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
    this.display = 'block'
  }

  onUpdateView(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
    this.display1 = 'block'
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
    this.display = "block";
  }

  onReload(): any {
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }


  // block and unblock code start
  // onSetId(id: string): void {
  //   this.selectPlanId = id;
  //   this.display2 = 'block'
  // }
  onSetBlockId(id: string): void {
    this.selectPlanId = id;
    this.display4 = 'block'
  }
  onSetUnblockId(id: string): void {
    this.selectPlanId = id;
    this.display2 = 'block'
  }



  onBlockUnblock(status: string): void {
      this.userService.blockUnblock(this.selectPlanId , status, this.adminType).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
        this.toastr.success(response.message);
      });
  }

  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }


  onCLose()
  {
    this.display = 'none';
    this.display2 = 'none'
    this.display4 = 'none'

  }


  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  handleCounterChange(event : any) {
    this.display = event;
    this.display1 = event;
  }

}
