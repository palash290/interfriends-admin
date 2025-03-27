import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { GroupCycle } from '../../../model/groupCycle.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { GroupCycleService} from '../../../service/groupCycle.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-cycle-list',
  templateUrl: './group-cycle-list.component.html',
  styleUrls: ['./group-cycle-list.component.css']
})
export class GroupCycleListComponent implements OnInit {

  lists: GroupCycle[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  groupId: string;
  showStatus = false;
  showMessage = '';
  display : string = 'none';


  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public groupCycleService: GroupCycleService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.groupCycleService.getLists(this.listsPerPage, this.currentPage, this.groupId);
      this.listsSub = this.groupCycleService.getListUpdateListener().subscribe(
        (listData: { lists: GroupCycle[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });

      this.userService.chekgroupLifeCycleExist(this.groupId)
      .subscribe((response: any) => {
        this.showStatus = response.showStatus;
        this.showMessage = response.showMessage;
      });
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
    this.display = 'block';
  }

  onReload(): any {
    this.groupCycleService.getLists(this.listsPerPage, this.currentPage, this.groupId);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  onBlockUnblock(status: string): void {
      this.groupCycleService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.groupCycleService.getLists(this.listsPerPage, this.currentPage, this.groupId);
        this.toastr.success(response.message);
      });
  }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.groupCycleService.getLists(this.listsPerPage, this.currentPage, this.groupId);
  }


  onError() {
    this.toastr.error(this.showMessage);
  }

  closeModalF(event : any) {
    this.display = event;
  }

}
