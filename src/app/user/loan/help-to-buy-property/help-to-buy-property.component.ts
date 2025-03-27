import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { Loan } from '../../../model/loan.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { LoanService} from '../../../service/loan.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-help-to-buy-property',
  templateUrl: './help-to-buy-property.component.html',
  styleUrls: ['./help-to-buy-property.component.css']
})
export class HelpToBuyPropertyComponent implements OnInit {

  lists: Loan[] = [];
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
  selectListStatusId: string;
  adminType: string;
  display : string = 'none';
  display1 : string = "none";


    // add edit code start
    listId: string;
    updateId: string;
    eachChange: string;
    add: string;
    // add edit code end


  constructor(
    public userService: UserService,
    public authService: AuthService,
    public loanService: LoanService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId =paramMap.get('groupId');
      this.userId =paramMap.get('userId');
      this.adminType = this.authService.getAdminType();
      const loan_type ="6";

      this.loanService.getListsHelp2Pay(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.adminType, loan_type);
      this.listsSub = this.loanService.getListHelp2PayUpdateListener().subscribe(
        (listData: { lists: Loan[]; listCount: number }) => {
        this.lists = listData.lists;
        this.totalLists =  listData.listCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
    });
  }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    const loan_type ="6";
    this.loanService.getListsHelp2Pay(this.listsPerPage, this.currentPage, this.userId, this.groupId, this.adminType,loan_type);
  }

  updateStatus(id: string, status: string, index: number) {
    this.loanService.editLoanStatus(id, status)
    .subscribe((response: any) => {
      this.toastr.success(response.message);
      this.selectListStatusId = '';
      this.lists[index]['status'] = status;
    });
  }


  checkCycleStatus(id: string) {
    // console.log(this.selectListStatusId, 'this.selectListId111');
    // console.log(id, 'this.selectListId2222');
    if(id === this.selectListStatusId) {
      return true;
    } else {
      return false;
    }
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onSetStatusId(id: string): void {
    if(this.selectListStatusId === id) {
      this.selectListStatusId = '';
    } else {
      this.selectListStatusId = id;
      console.log(this.selectListStatusId, 'this.selectListStatusId');
    }
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
      this.ngOnInit();
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
    this.display = "block";
  }

  closeModalF(event : any) {
    this.display = event;
    this.display1 = event;
  }
  // add edit code end

  sendHeader(name:string){
    console.log(name,"name")
    this.userService.sendheaderName(name)
  }
}
