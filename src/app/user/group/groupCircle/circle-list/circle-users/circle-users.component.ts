import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UsergroupList } from 'src/app/model/usergroupList.model';
import { GroupService } from 'src/app/service/group.service';
import { SingleUserGroupList } from 'src/app/service/singleUserGroupList.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-circle-users',
  templateUrl: './circle-users.component.html',
  styleUrls: ['./circle-users.component.css']
})
export class CircleUsersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('closeBlock') closeModal: ElementRef;
  @ViewChild('closeBlock2') closeModal2: ElementRef;
  users: UsergroupList[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectPlanId: string;
  groupId: string;
  userId: string = '';
  tableId: string = '';
  selectedCircleId: string = '';
  circleId: string;
  search = '';
  showStatus = false;
  showMessage = '';
  groupName: string;
  // view detail
  updateId: string;
  eachChange: string;
  add: string;
  circleName: string;
  display: string = "none";
  circlelists: any[] = [];

  constructor(
    public singleUserGroupList: SingleUserGroupList,
    public userService: UserService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.circleId = paramMap.get('circleId');

      localStorage.setItem('groupId_interFriendAdmin', this.groupId);
      this.groupName = localStorage.getItem('GroupnameForUserList');
      this.getUsers(this.usersPerPage, this.currentPage, this.search)
      // this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
      // this.usersSub = this.singleUserGroupList.getUserUpdateListener().subscribe(
      //   (userData: { users: UsergroupList[]; userCount: number }) => {
      //   this.users = userData.users;
      //   this.totalUsers =  userData.userCount;
      //   this.isLoading = false;
      //   this.isLoadingPage = false;
      // });

      this.userService.chekgroupLifeCycleExist(this.groupId)
        .subscribe((response: any) => {
          this.showStatus = response.showStatus;
          console.log(this.showStatus, 'this.showStatus')
          this.showMessage = 'You can only edit info once current cycle will completed';
        });
    });
  };



  getUsers(usersPerPage: number, currentPage: number, search: string) {

    const userData = new FormData();

    if (currentPage) {
      const totalPage = usersPerPage * currentPage;
      userData.append('start', totalPage.toString());
    }

    userData.append('group_id', this.groupId);
    userData.append('circle_id', this.circleId);
    // userData.append('group_id_not', group_id_not);
    userData.append('search_keyword', search);

    this.groupService
      .postAPI(
        '/circleUser_list', userData
      ).subscribe(responseData => {
        this.circleName = responseData.circle_name;
        this.users = responseData.userList;

        this.totalUsers = responseData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
       
      });
  };

  submitMove() {

    const userData = new FormData();

    userData.append('group_id', this.groupId);
    userData.append('circle_id', this.circleId);
    userData.append('movegroup_id', this.groupId);
    userData.append('movecircle_id', this.selectedCircleId);
    userData.append('moveuser_id', this.userId);
    userData.append('id', this.tableId);

    this.groupService
      .postAPI(
        '/moveCircle', userData
      ).subscribe(responseData => {
        this.closeModal.nativeElement.click()
        this.getUsers(this.usersPerPage, this.currentPage, this.search);

        // this.usersUpdated.next({
        //   users: [...this.users],
        //   userCount: responseData.userCount,
        // });
      });
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.singleUserGroupList.getUsers(this.usersPerPage, this.currentPage, this.groupId, '', this.search);
  }


  // add edit code start

  onUpdate(type:string,id: string): void {
    this.updateId = id;
    if(type =='edit'){
      this.display = "block";
    }
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
  };

  getCircleList(userID: any, id: any) {
    this.userId = userID;
    this.tableId = id;
    const formData = new FormData();
    formData.append('group_id', this.groupId);
    this.groupService.postAPI('/getCircleBygroupid', formData).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.isLoading = false;
          this.isLoadingPage = false;
          this.circlelists = res.data;
        } else {
          this.isLoading = false;
          this.isLoadingPage = false;
        }
      }
    })
  }

  onAdd(): void {
    this.add = Math.random().toString();
  }

  onReload(): any {
    this.getUsers(this.usersPerPage, this.currentPage,this.search);
  }


  // block and unblock code start
  onSetId(id: string): void {
    this.selectPlanId = id;
  };

  sendEmail(data:NgForm){
    console.log("data", data);
    data.control.markAllAsTouched();
    if(data.invalid){
      return
    }
    const userData = new FormData();

    userData.append('user_id', this.updateId);
    userData.append('subject', data.value.subject);
    userData.append('message', data.value.body);
    this.groupService
      .postAPI(
        '/sendEmailtoUserinCircle', userData
      ).subscribe(responseData => {
        if(responseData.success == 0){
          this.toastr.warning(responseData.message);
        }else{
          this.toastr.success(responseData.message)
          // this.totalUsers =  responseData.userCount;
          this.isLoading = false;
          this.isLoadingPage = false;
          document.getElementById('closeBlock3').click();
        }
    
       
      });
  };


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



  ngOnDestroy(): void {
    // this.usersSub.unsubscribe();
  }


  onError() {
    this.toastr.error(this.showMessage);
  };


  onDelete(){
   
    const formData = new FormData();
    formData.append('id', this.updateId);
    this.groupService.postAPI('/deleteUserCircle', formData).subscribe({
      next: (res: any) => {
        this.closeModal2.nativeElement.click();
        document.getElementById('closeBlock2').click();
        if (res.success == 1) {
          this.isLoading = false;
          this.isLoadingPage = false;
          this.getUsers(this.usersPerPage, this.currentPage, this.search)
        } else {
          this.isLoading = false;
          this.isLoadingPage = false;
        }
      }
    })
  }

}
