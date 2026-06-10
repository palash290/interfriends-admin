import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Property } from '../../../model/property.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { PropertyService } from '../../../service/property.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  lists: Property[] = [];
  listDetail: Property;
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  display: string = 'none';
  display1: string = 'none';
  display2: string = 'none';

  displayClose: string = 'none';
  display2Close: string = 'none';

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public propertyService: PropertyService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.propertyService.getLists(this.listsPerPage, this.currentPage);
    this.listsSub = this.propertyService.getListUpdateListener().subscribe(
      (listData: { lists: Property[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists = listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  }


  // block and unblock code start
  onSetId(id: string, action: string): void {
    this.selectListId = id;
    if (action === 'block') {
      this.display = "block";
    } else {
      this.display2 = "block";
    }
  }

  onSetIdClose(id: string, action: string): void {
    this.selectListId = id;
    if (action === '1') {
      this.displayClose = "block";
    } else {
      this.display2Close = "block";
    }
  }

  onBlockUnblock(status: string): void {
    this.propertyService.blockUnblock(this.selectListId, status).subscribe((response: any) => {
      this.onClose();
      if (response.status === '1') {
        document.getElementById('closeUnblock').click();
      } else {
        document.getElementById('closeBlock').click();
      }
      this.propertyService.getLists(this.listsPerPage, this.currentPage);
      this.toastr.success(response.message);
    });
  }

  onCloseOpen(status: string): void {
    this.propertyService.openCloseProperty(this.selectListId, status).subscribe((response: any) => {
      this.onClose();
      if (response.is_closed === '0') {
        document.getElementById('closeUnblock1').click();
      } else {
        document.getElementById('closeBlock1').click();
      }
      this.propertyService.getLists(this.listsPerPage, this.currentPage);
      this.toastr.success(response.message);
    });
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
    this.display1 = "block";
  }

  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.propertyService.getLists(this.listsPerPage, this.currentPage);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onClose(): void {
    this.display = 'none';
    this.display1 = 'none';
    this.display2 = 'none';
    this.displayClose = 'none';
    this.display2Close = 'none';
  }

}
