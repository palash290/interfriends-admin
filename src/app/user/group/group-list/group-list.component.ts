import { Component, OnInit, ViewChild } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { Group } from '../../../model/group.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { GroupService} from '../../../service/group.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  @ViewChild('mailForm') mailForm: NgForm;
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
  display : string = "none"
  display1 : string = "none"
  display2 : string = "none"
  display3 : string = "none"
  display4 : string = "none"


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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.adminType = this.authService.getAdminType();
    this.groupService.getLists(this.listsPerPage, this.currentPage);
    this.listsSub = this.groupService.getListUpdateListener().subscribe(
      (listData: { lists: Group[]; listCount: number }) => {
      this.lists = listData.lists;
      this.totalLists =  listData.listCount;
      this.isLoading = false;
      this.isLoadingPage = false;
    });
  }

  // add edit code start


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display3 = "block";
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
    this.display3 = "block";
  }

  saveGroupname(groupName :string){
   localStorage.setItem("GroupnameForUserList", groupName);
  }

  onReload(): any {
    this.groupService.getLists(this.listsPerPage, this.currentPage);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
    this.display1 = "block";
  }
  // block and unblock code start
  onSetUnBlockId(id: string): void {
    this.selectListId = id;
    this.display2 = "block";
  }

  onBlockUnblock(status: string): void {
      this.groupService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.groupService.getLists(this.listsPerPage, this.currentPage);
        this.toastr.success(response.message);
      });
  }

  closeModalF(event : any) {
    this.display = event;
  }

  onClose(): void {
    this.display= "none";
  }

  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.groupService.getLists(this.listsPerPage, this.currentPage);
  };


  sendLeadsEmail(data:NgForm){
    data.control.markAllAsTouched()
    if(data.invalid){
      return
    }
    const userData = new FormData();

    userData.append('subject', data.value.subject);
    userData.append('message', data.value.body);
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

  ngOnDestroy(): void {
    // Unsubscribe from route parameters subscription when component is destroyed
    if (this.listsSub) {
      this.listsSub.unsubscribe();
    }
  }

}
