import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { Miscellaneous } from '../../../model/miscellaneous.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MiscellaneousService} from '../../../service/miscellaneous.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-miscellaneous-list',
  templateUrl: './miscellaneous-list.component.html',
  styleUrls: ['./miscellaneous-list.component.css']
})
export class MiscellaneousListComponent implements OnInit {

  lists: Miscellaneous[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display : string = 'none';
  display1 : string = 'none';

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public miscellaneousService: MiscellaneousService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.miscellaneousService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
      this.listsSub = this.miscellaneousService.getListUpdateListener().subscribe(
        (listData: { lists: Miscellaneous[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
    });
  }

  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display1 = "block";
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
    this.miscellaneousService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  // onBlockUnblock(status: string): void {
  //     this.emergencyLoanService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
  //       if (response.status === '1') {
  //         document.getElementById('closeUnblock').click();
  //       } else {
  //         document.getElementById('closeBlock').click();
  //       }
  //       this.emergencyLoanService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  //       this.toastr.success(response.message);
  //     });
  // }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.miscellaneousService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  closeModalF(event : any) {
    this.display = event;
  }

  closeModalF1(event : any){
    this.display1 = event;
  }

}
