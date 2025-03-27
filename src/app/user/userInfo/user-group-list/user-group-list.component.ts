import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SingleUserGroupList } from 'src/app/service/singleUserGroupList.service';
import { UsergroupList } from 'src/app/model/usergroupList.model';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';



@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.css']
})
export class UserGroupListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('closeModal') closeModal!:ElementRef;
  @ViewChild('closeModal2') closeModal2!:ElementRef;
  users: UsergroupList[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  userID: any;
  ID: any
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectPlanId: string;
  groupId: string;
  search = '';
  showStatus = false;
  showMessage = '';
  groupName: string;
  // view detail
  updateId: string;
  eachChange: string;
  add: string;
  display: string = "none"
  display4: string = "none"
  display5: string = "none"

  constructor(
    public singleUserGroupList: SingleUserGroupList,
    public userService: UserService,
    public userListService: UserListService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      localStorage.setItem('groupId_interFriendAdmin', this.groupId);
      this.groupName = localStorage.getItem('GroupnameForUserList')
      this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
      this.usersSub = this.singleUserGroupList.getUserUpdateListener().subscribe(
        (userData: { users: UsergroupList[]; userCount: number }) => {
          this.users = userData.users;
          this.totalUsers = userData.userCount;
          this.isLoading = false;
          this.isLoadingPage = false;
        });

      this.userService.chekgroupLifeCycleExist(this.groupId)
        .subscribe((response: any) => {
          this.showStatus = response.showStatus;
          console.log(this.showStatus, 'this.showStatus')
          this.showMessage = 'You can only edit info once current cycle will completed';
        });
    });
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
  }


  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
    this.display = "block";
  }
  onOpenMailModel(id: string, userId: any): void {
    console.log("clikd")
    this.ID = id;
    this.userID = userId;
    // this.eachChange = Math.random().toString();
    // this.display4 = "block";
  }

  closeModalF(event: any) {
    this.display = event;
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

  onReload(): any {
    this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
  }


  // block and unblock code start
  onSetId(id: string): void {
    this.selectPlanId = id;
  }


  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }



  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }


  onError() {
    this.toastr.error(this.showMessage);
  }

  onSendMail() {
    // this.isLoading = true;
    const userData = new FormData();
    userData.append('user_id', this.userID.toString());
    userData.append('id', this.ID);

    this.userListService.postAPI('/sendEmailtoUserGroup', userData)
      .subscribe((response: any) => {
        this.closeModal.nativeElement.click()
        const mailButton = document.getElementById('sendMail') as HTMLElement
        mailButton.classList.remove("show");
        this.display4 = 'none'
console.log(this.display4);
        this.toastr.success(response.message);
        // this.isLoading = false;
      });
  };
  onSendMailToAll() {
    this.isLoading = true;
    const userData = new FormData();
    userData.append('group_id', this.groupId .toString());
   

    this.userListService.postAPI('/sendEmailtoUserGroupAll', userData)
      .subscribe((response: any) => {
       
        this.closeModal2.nativeElement.click()
        const mailButton = document.getElementById('sendMail') as HTMLElement
        mailButton.classList.remove("show");
        this.display5 = 'none'

        this.toastr.success(response.message);
        this.isLoading = false;
      }
      ,(err)=>{
        this.display5 = 'none'
        this.closeModal2.nativeElement.click()
        this.toastr.success("Sent successfully");
        this.isLoading = false;
       

      });
  };

  onCLose() {
    this.display4 = 'none'
  }

}
