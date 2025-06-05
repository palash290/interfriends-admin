import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserList } from 'src/app/model/userList.model';
import { GroupService } from 'src/app/service/group.service';
import { UserGroupService } from 'src/app/service/userGroupList.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  users: any[] = [];
  selectUser: any[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  groupId: string;
  circleId: string;
  search = '';


  constructor(
    public userService: UserGroupService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private router: Router,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.circleId = paramMap.get('circleId');
      localStorage.setItem('groupId_interFriendAdmin', this.groupId);
      this.getUsers(this.usersPerPage, this.currentPage, '', this.groupId, this.search);
      this.usersSub = this.userService.getUserUpdateListener().subscribe(
        (userData: { users: UserList[]; userCount: number }) => {
          this.users = userData.users;
          this.totalUsers = userData.userCount;
          this.isLoading = false;
          this.isLoadingPage = false;
        });
    });
  };


  getUsers(usersPerPage: number, currentPage: number, groupId: string, group_id_not: string, search: string) {
    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }
    userData.append('search_keyword', this.search);

    this.groupService
      .postAPI(
        '/getUserWaitingList', userData
      ).subscribe(responseData => {
        if (responseData.success == 1) {
          this.users = responseData?.users;
          this.totalUsers = responseData.userCount;
          this.isLoadingPage = false;
          this.isLoading = false;
        } else {
          this.users = [];
          this.totalUsers = responseData.userCount;
          this.isLoadingPage = false;
          this.isLoading = false;
        }

      });
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.getUsers(this.usersPerPage, this.currentPage, '', this.groupId, this.search);
  };

  // search start
  keyPress(): any {
    if (this.users?.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getUsers(this.usersPerPage, this.currentPage, '', this.groupId, this.search);
  };



  onCheck(ev: any, data: string): any {
    if (ev.target.checked) {
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
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }




  onSave() {
    if (this.selectUser.length > 0) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("circle_id", this.circleId)
      formData.append("group_id", this.groupId)
      formData.append("isWaiting", '1')
      formData.append("users", this.selectUser.join())
      this.groupService.postAPI('/adduserGroupCircle', formData)
        .subscribe((response: any) => {

          if (response.success == 1) {
            this.isLoading = false;
            this.toastr.success(response.message);
            this.router.navigate(['/user/circleUserList', this.groupId, this.circleId]);
          } else {
            this.toastr.error(response.message);
            this.isLoading = false;
          }
        });
    } else {
      this.toastr.error('Please Select One Of User');
    }
  };


  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }


}
