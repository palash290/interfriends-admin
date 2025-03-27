import { Component, OnInit } from '@angular/core';
import { Pf } from '../../../model/pf.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import {PfService} from '../../../service/pf.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pf-list',
  templateUrl: './pf-list.component.html',
  styleUrls: ['./pf-list.component.css']
})
export class PfListComponent implements OnInit {

  lists: Pf[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  pfAmount = 0;
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
    public pfService: PfService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.pfService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
      this.listsSub = this.pfService.getListUpdateListener().subscribe(
        (listData: { lists: Pf[]; listCount: number; pfAmount: number}) => {
          this.pfAmount = listData.pfAmount;
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
    });
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.pfService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


   // add edit code start

   onUpdate(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
  }

  hidePopup(status: string): void {
    if (status === 'add') {
      this.ngOnInit();
    } else {
      this.ngOnInit();
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
  }

  // add edit code end

  openModal()
  {
    this.display= "block";
  }

  closeModalF(event : any) {
    this.display = event;
  }
}
