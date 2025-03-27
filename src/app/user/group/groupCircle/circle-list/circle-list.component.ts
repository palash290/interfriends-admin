import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/model/group.model';
import { AuthService } from 'src/app/service/auth.service';
import { GroupService } from 'src/app/service/group.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.css']
})
export class CircleListComponent implements OnInit {

  @ViewChild('mailForm') mailForm: NgForm;
  form: FormGroup;

  mode = 'create';
  lists: Group[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  adminType: string;
  display: string = "none"
  groupID: any;
  circleID: any;
  circleUsersList: any[] = [];
  selecteduser: any = ''

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public groupService: GroupService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      circle_name: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.params.subscribe(params => {
      // Retrieve individual parameters using params object
      this.groupID = params['groupID']; // Replace 'paramName' with the name of your parameter


    });
    this.getCircleList()
    this.adminType = this.authService.getAdminType();

    // this.listsSub = this.groupService.getListUpdateListener().subscribe(
    //   (listData: { lists: Group[]; listCount: number }) => {
    //   this.lists = listData.lists;
    //   this.totalLists =  listData.listCount;
    //   this.isLoading = false;
    //   this.isLoadingPage = false;
    // });
  };


  getCircleList() {
    const formData = new FormData();
    formData.append('group_id', this.groupID);
    this.groupService.postAPI('/getCircleBygroupid', formData).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.isLoading = false;
          this.isLoadingPage = false;
          this.lists = res.data;
        } else {
          this.isLoading = false;
          this.isLoadingPage = false;
        }
      }
    })
  }

  // add edit code start


  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  };

  getcircleUsers(circleId: any) {
    this.mailForm.reset()
    this.circleID = circleId;
    const userData = new FormData();



    userData.append('group_id', this.groupID);
    userData.append('circle_id', circleId);
    // userData.append('group_id_not', group_id_not);
    userData.append('search_keyword', '');

    this.groupService
      .postAPI(
        '/circleUser_list', userData
      ).subscribe(responseData => {
        this.circleUsersList = responseData.userList;
        
        // this.totalUsers =  responseData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
        // this.usersUpdated.next({
        //   users: [...this.users],
        //   userCount: responseData.userCount,
        // });
      });

  };

  onAssignLead() {
    const userData = new FormData();

    userData.append('group_id', this.groupID);
    userData.append('circle_id', this.circleID);
    // userData.append('group_id_not', group_id_not);
    userData.append('user_id', this.selecteduser);

    this.groupService
      .postAPI(
        '/assignLeadcircle', userData
      ).subscribe(responseData => {
        
       
        // this.totalUsers =  responseData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
        document.getElementById('closeBlock').click();
        this.getCircleList();
        // this.usersUpdated.next({
        //   users: [...this.users],
        //   userCount: responseData.userCount,
        // });
      });
  };
  onAssignDeputy() {
    const userData = new FormData();

    userData.append('group_id', this.groupID);
    userData.append('circle_id', this.circleID);
    // userData.append('group_id_not', group_id_not);
    userData.append('user_id', this.selecteduser);

    this.groupService
      .postAPI(
        '/assigndeputyleadcircle', userData
      ).subscribe(responseData => {
        
       
        // this.totalUsers =  responseData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
        document.getElementById('closeBlock5').click();
        this.getCircleList();
        // this.usersUpdated.next({
        //   users: [...this.users],
        //   userCount: responseData.userCount,
        // });
      });
  };

  sendEmail(data:NgForm){
    data.control.markAllAsTouched()
    if(data.invalid){
      return
    }
    const userData = new FormData();

    userData.append('circle_id', this.circleID);
    userData.append('subject', data.value.subject);
    userData.append('message', data.value.body);
    this.groupService
      .postAPI(
        '/sendEmailtoAllmembersinCircle', userData
      ).subscribe(responseData => {
        if(responseData.success == 0){
          this.toastr.warning(responseData.message);
          this.mailForm.reset();
        }else{
          this.toastr.success(responseData.message);
          // this.totalUsers =  responseData.userCount;
          this.isLoading = false;
          this.isLoadingPage = false;
        }
        document.getElementById('closeBlock2').click();
    
       
      });
  };

  sendLeadsEmail(data:NgForm){
    data.control.markAllAsTouched()
    if(data.invalid){
      return
    }
    const userData = new FormData();

    userData.append('circle_id', this.circleID);
    userData.append('subject', data.value.subject);
    userData.append('message', data.value.message);
    this.groupService
      .postAPI(
        '/sendEmailtoAllCirclelead', userData
      ).subscribe(responseData => {
        this.mailForm.reset();
        if(responseData.success == 0){
          this.toastr.warning(responseData.message);
        }else{
          this.toastr.success(responseData.message);
          // this.totalUsers =  responseData.userCount;
          this.isLoading = false;
          this.isLoadingPage = false;
        }
        document.getElementById('closeBlock2').click();
    
       
      });
  };

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display = "block";
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

  saveGroupname(groupName: string) {
    localStorage.setItem("GroupnameForUserList", groupName);
  }

  onReload(): any {
    this.groupService.getLists(this.listsPerPage, this.currentPage);
  }


  onSave(): void {
    this.form.markAllAsTouched();
    // console.log(this.form.invalid);
    console.log(this.form.value.members, 'selectedItems');

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      formData.append('circle_name', this.form.value.circle_name)
      formData.append('description', this.form.value.description)
      formData.append('group_id', this.groupID)
      this.groupService.postAPI('/addgroupCircle', formData

      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;


        if (response.success === '1') {
          // this.valueChange.emit('add');
          // this.router.navigate(['/user/UserGroupAddList',response.group_id]);
          this.getCircleList();
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    } else {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      // this.groupService.editGroup(
      //   this.group.id,
      //   this.form.value.group_cycle_name,
      //   this.form.value.group_cycle_descp
      // ).subscribe((response: any) => {
      //   this.form.reset();
      //   document.getElementById('closePopup').click();
      //   this.isLoading = false;
      //   if (response.success === '1') {
      //     this.valueChange.emit('update');
      //     this.toastr.success(response.message);
      //   } else {
      //     this.toastr.error(response.message);
      //   }
      // });
    }
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
    this.display = "block";
  }

  onBlockUnblock(status: string): void {
    this.groupService.blockUnblock(this.selectListId, status).subscribe((response: any) => {
      if (response.status === '1') {
        document.getElementById('closeUnblock').click();
      } else {
        document.getElementById('closeBlock').click();
      }
      this.groupService.getLists(this.listsPerPage, this.currentPage);
      this.toastr.success(response.message);
    });
  }

  closeModalF(event: any) {
    this.display = event;
  }

  onClose(): void {
    this.display = "none";
  }

  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.groupService.getLists(this.listsPerPage, this.currentPage);
  }

}
