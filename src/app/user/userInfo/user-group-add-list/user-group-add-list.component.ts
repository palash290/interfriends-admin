import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserList } from '../../../model/userList.model';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, ParamMap, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserGroupService } from 'src/app/service/userGroupList.service';

@Component({
  selector: 'app-user-group-add-list',
  templateUrl: './user-group-add-list.component.html',
  styleUrls: ['./user-group-add-list.component.css']
})
export class UserGroupAddListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static : false} ) paginator: MatPaginator;
  users: UserList[] = [];
  selectUser: any[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  groupId: string;
  search = '';


  constructor(
    public userService: UserGroupService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      localStorage.setItem('groupId_interFriendAdmin', this.groupId);
      this.userService.getUsers(this.usersPerPage, this.currentPage, '',this.groupId, this.search);
      this.usersSub = this.userService.getUserUpdateListener().subscribe(
        (userData: { users: UserList[]; userCount: number }) => {
        this.users = userData.users;
        this.totalUsers =  userData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
    });
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage, '',this.groupId, this.search);
  }

  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.userService.getUsers(this.usersPerPage, this.currentPage, '',this.groupId, this.search);
  }



  onCheck(ev: any, data: string): any {
    if (ev.target.checked){
      // Pushing the object into array
      this.selectUser.push(data);
      console.log(this.selectUser, 'selectUser');
    } else {
      const removeIndex = this.selectUser.indexOf(data);
      if (removeIndex !== -1) {
        this.selectUser.splice(removeIndex, 1);
      }
    }
  }

  checkUserExist(id: string) {
    return this.selectUser.includes(id);
  }


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }




  onSave() {
    if (this.selectUser.length > 0) {
      this.isLoading = true;
      this.userService.adduserGroup(this.groupId, this.selectUser.join())
      .subscribe((response: any) => {
        this.isLoading = false;
        this.toastr.success(response.message);
        this.router.navigate(['/user/userGroupList', this.groupId]);
      });
    } else {
      this.toastr.error('Please Select One Of User');
    }
  }



  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

}
