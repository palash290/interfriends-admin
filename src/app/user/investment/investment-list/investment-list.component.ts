import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { InvestmentService} from '../../../service/investment.service';
import { ToastrService } from 'ngx-toastr';
import { Investment } from 'src/app/model/investment.model';
import { ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-investment-list',
  templateUrl: './investment-list.component.html',
  styleUrls: ['./investment-list.component.css']
})
export class InvestmentListComponent implements OnInit {

  lists: Investment[] = [];
  listDetail: Investment;
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
  payment_status = '2';


  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  display : string = 'none';
  display1 : string = 'none';
  // add edit code end

  constructor(
    public userService: UserService,
    public investmentService: InvestmentService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.investmentService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.payment_status);
      this.listsSub = this.investmentService.getListUpdateListener().subscribe(
        (listData: { lists: Investment[]; listCount: number }) => {
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
    this.display  = 'block';
  }

  onUpdateEdit(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display1  = 'block';
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
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
    this.display1  = 'block';
  }

  onReload(): any {
    this.investmentService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.payment_status);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  onBlockUnblock(status: string): void {
      this.investmentService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.investmentService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.payment_status);
        this.toastr.success(response.message);
      });
  }

  onview(id: string, index: number) {
    this.listDetail = this.lists[index];
  }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.investmentService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.payment_status);
  }

  closeModalF(event : any) {
    this.display = event;
    this.display1  = event;
  }

}
