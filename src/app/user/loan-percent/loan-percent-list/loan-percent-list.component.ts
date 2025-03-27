import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { Loanpercent } from 'src/app/model/loanpercent.model';
import { LoanpercentService } from 'src/app/service/loanpercent.service';

@Component({
  selector: 'app-loan-percent-list',
  templateUrl: './loan-percent-list.component.html',
  styleUrls: ['./loan-percent-list.component.css']
})
export class LoanPercentListComponent implements OnInit {

  lists: Loanpercent[] = [];
  totalLists = 0;
  listsPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private listsSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectListId: string;
  adminType: string;
  display : string = 'none';


  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public loanpercentService: LoanpercentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.adminType = this.authService.getAdminType();
    this.loanpercentService.getLists(this.listsPerPage, this.currentPage);
    this.listsSub = this.loanpercentService.getListUpdateListener().subscribe(
      (listData: { lists: Loanpercent[]; listCount: number }) => {
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
    this.display = "block"
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

  onReload(): any {
    this.loanpercentService.getLists(this.listsPerPage, this.currentPage);
  }

  // add edit code end



  // block and unblock code start
  onSetId(id: string): void {
    this.selectListId = id;
  }

  onBlockUnblock(status: string): void {
      this.loanpercentService.blockUnblock(this.selectListId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.loanpercentService.getLists(this.listsPerPage, this.currentPage);
        this.toastr.success(response.message);
      });
  }


  onChangedPage(pageData: PageEvent): any {
    console.log(pageData.pageIndex, 'pageData.pageIndex');
    console.log(pageData.pageSize, 'pageData.pageSize');
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.loanpercentService.getLists(this.listsPerPage, this.currentPage);
  }

  closeModalF(event : any) {
    this.display = event;
  }

}
