import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/service/group.service';
import { SafeKeepingService } from 'src/app/service/safeKeeping.service';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-download-data',
  templateUrl: './download-data.component.html',
  styleUrls: ['./download-data.component.css']
})
export class DownloadDataComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  lists: any[] = [];
  usersPerPage = 200;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  totalLists: any = 0;
  listsPerPage = 200;
  isLoading = false;
  isLoadingPage = false;
  selectListId: string;
  userId: string;
  groupId: string;
  display: string = 'none';
  search = '';

  startDate: any = '';
  endDate: any = '';

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  loanList: any;
  changedStatus: any = '';
  selectedLoanType: any = '';
  selectedGroupType: any = '';
  // add edit code end

  constructor(
    public userService: UserService,
    public safeKeepingService: SafeKeepingService,
    public userListService: UserListService,
    public route: ActivatedRoute,
    public groupService: GroupService,
  ) { }

  ngOnInit(): void {
    // this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search)
  }

  getAdminNotifications(listsPerPage: any, currentPage: any, search_keyword: any) {
    const listData = new FormData();

    // Set isLoading only if no search_keyword
    if (!search_keyword) {
      this.isLoading = true;
    }

    if (currentPage) {
      const totalPage = listsPerPage * currentPage;
      listData.append('start', totalPage.toString());
    }

    listData.append('search', search_keyword);
    listData.append('product_category', this.selectedGroupType);

    if (this.startDate && this.endDate) {
      listData.append('date_range', `${this.startDate}, ${this.endDate}`);
    }

    this.userListService.postAPI('/getDownloadableData', listData).subscribe(
      (listData: any) => {
        this.lists = listData.resultList;
        this.totalLists = listData.resultCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      }
    );
  }


  change() {
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
  }

  reset() {
    this.startDate = '';
    this.endDate = '';
    this.selectedGroupType = '';
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  // search start
  keyPress(): any {
    if (this.lists.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getAdminNotifications(this.usersPerPage, this.currentPage, this.search);
  }

  onReload(): any {
    this.safeKeepingService.getLists(this.listsPerPage, this.currentPage, this.userId, this.groupId);
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.listsPerPage = pageData.pageSize;
    this.getAdminNotifications(this.listsPerPage, this.currentPage, '');
  }


  downloadCSV(): void {
    const rows = this.lists.map((list, index) => {
      return {
        '#': index + 1,
        'First Name': list.first_name,
        'Last Name': `${list.last_name}`,
        'Email': list.email,
        'Amount': list.amount,
        'Type': list.type,
        'Created On': new Date(list.created_at).toLocaleDateString()
      };
    });

    const csvContent = this.convertToCSV(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'interfriends.csv');
    link.click();
  }

  convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]).join(',');
    const rows = objArray.map(row =>
      Object.values(row)
        .map(value => `"${(value ?? '').toString().replace(/"/g, '""')}"`) // Escape quotes
        .join(',')
    );
    return [header, ...rows].join('\r\n');
  }

  typeLabels: { [key: string]: string } = {
    payout: 'Payout',
    investment: 'Investment',
    property: 'Property',
    pf_user: 'Pf User',
    emergency_loan_completed: 'Emergency Loan Completed',
    emergency_loan_active: 'Emergency Loan Active',
    loan_completed: 'Loan Completed',
    loan_paid: 'Loan Paid',
    help_to_buy_car: 'Help To Buy Car',
    help_to_pay_car_insurance: 'Help To Pay Car Insurance',
    help_to_pay_cc: 'Help To Pay CC',
    help_to_buy_house: 'Help To Buy House',
    dividend: 'Dividend',
    miscellaneous: 'Miscellaneous',
    welfare_cycle: 'Welfare',
    jnr_saving: 'Saving JNR',
    saving_pending: 'Pending Savings',
    saving: 'Saving',
    safekeeping_add: 'Safekeeping Add',
    safekeeping_remove: 'Safekeeping Remove',
    active_loan: 'Active Loan'
  };


}