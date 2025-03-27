import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { SafeKeeping } from '../../../model/safeKeeping.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import {SafeKeepingService} from '../../../service/safeKeeping.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-safe-keeping-list',
  templateUrl: './safe-keeping-list.component.html',
  styleUrls: ['./safe-keeping-list.component.css']
})
export class SafeKeepingListComponent implements OnInit {

  lists: SafeKeeping[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  safeKeepingAmount = 0;
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  userId: string;
  groupId: string;
  display : string = 'none';


  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public safeKeepingService: SafeKeepingService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.safeKeepingService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
      this.listsSub = this.safeKeepingService.getListUpdateListener().subscribe(
        (listData: { lists: SafeKeeping[]; listCount: number; safeKeepingAmount: number }) => {
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.safeKeepingAmount = listData.safeKeepingAmount;
        console.log(this.safeKeepingAmount, 'this.safeKeepingAmount');
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

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onReload(): any {
    this.safeKeepingService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  // onBlockUnblock(status: string): void {
  //     this.safeKeepingService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
  //       if (response.status === '1') {
  //         document.getElementById('closeUnblock').click();
  //       } else {
  //         document.getElementById('closeBlock').click();
  //       }
  //       this.safeKeepingService.getLists(this.listsPerPage, this.currentPage);
  //       this.toastr.success(response.message);
  //     });
  // }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.safeKeepingService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }

  openModal(){
    this.display = "block";
  }
  closeModalF(event : any) {
    this.display = event;
  }
}
