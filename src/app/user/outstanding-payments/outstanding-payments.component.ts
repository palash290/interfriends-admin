import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-outstanding-payments',
  templateUrl: './outstanding-payments.component.html',
  styleUrls: ['./outstanding-payments.component.css']
})
export class OutstandingPaymentsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  users: any[] = [];
  isLoading = false;
  isLoadingPage = false;
  search = '';

  totalUsers = 0;
  usersPerPage = 10;
  selectedUsersPerPage: number | 'all' = 10;
  currentPage = 0;
  selectedGroupType: any = '';

  startDate: any = '';
  endDate: any = '';
  display: string = "none";

  group_ids: any;
  circle_ids: any;

  constructor(public userService: UserListService, public sharedService: SharedService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.group_ids = localStorage.getItem('group_ids');
    this.circle_ids = localStorage.getItem('circle_ids');
    // this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  getUsers(usersPerPage: any, currentPage: any, search: any) {
    const userData = new FormData();

    const totalPage = usersPerPage * currentPage;
    userData.append('start', totalPage.toString());
    userData.append('limit', usersPerPage.toString());

    if (this.group_ids) {
      userData.append('group_ids', this.group_ids.toString());
    }

    if (this.circle_ids) {
      userData.append('circle_ids', this.circle_ids.toString());
    }

    userData.append('search', this.search || '');
    // userData.append('type', this.selectedGroupType);

    if (this.startDate && this.endDate) {
      userData.append('date_range', `${this.startDate}, ${this.endDate}`);
    }

    // Select API based on Group Type
    let apiUrl = '';

    switch (this.selectedGroupType) {
      case '1':
        apiUrl = '/getOutstandingLoanPayments';
        break;

      case '2':
        apiUrl = '/getOutstandingHelpToPayCarInsurancePayments';
        break;

      case '3':
        apiUrl = '/getOutstandingHelpToBuyCarPayments';
        break;

      case '4':
        apiUrl = '/getOutstandingHelpToPayCreditCardPayments';
        break;

      case '5':
        apiUrl = '/getOutstandingHelpMePaySomethingElsePayments';
        break;

      case '6':
        apiUrl = '/getOutstandingHelpToBuyHousePayments';
        break;

      case '7':
        apiUrl = '/getOutstandingWelfarePayments';
        break;

      case '8':
        apiUrl = '/getOutstandingEmergencyLoanPayments';
        break;

      case '9':
        apiUrl = '/getOutstandingSavingPayments';
        break;

      case '10':
        apiUrl = '/getOutstandingSavingJnrPayments';
        break;

      case '11':
        apiUrl = '/getOutstandingMiscellaneousPayments';
        break;

      default:
        console.error('Invalid group type:', this.selectedGroupType);
        return;
    }

    this.isLoading = true;

    this.sharedService.postAPI(apiUrl, userData).subscribe({
      next: (resp) => {
        this.users = resp.lists || [];
        this.totalUsers = resp.listCount || 0;

        this.isLoading = false;
        this.isLoadingPage = false;
      },

      error: (error) => {
        this.isLoading = false;
        this.isLoadingPage = false;

        console.error('API Error:', error?.message || error);
      }
    });
  }

  private getRequestedPageSize(): number {
    if (this.selectedUsersPerPage === 'all') {
      return Math.max(this.totalUsers, this.users.length, 10);
    }

    return this.selectedUsersPerPage;
  }

  onPageSizeChange(): void {
    this.isLoadingPage = true;
    this.currentPage = 0;
    this.usersPerPage = this.getRequestedPageSize();

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  getPaymentAmount(user: any): any {
    switch (+this.selectedGroupType) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return user.loan_emi;

      case 8:
        return user.payment_amount;

      case 9:
        return user.payment_amount;

      case 10:
        return user.payment_amount;

      case 11:
        return user.payment_amount;

      default:
        return '';
    }
  }

  getPaymentDate(user: any): any {
    switch (+this.selectedGroupType) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return user.payment_emi_date;

      case 8:
        return user.payment_date;

      case 9:
        return user.monthly_payment_date;

      case 10:
        return user.monthly_payment_date;

      case 11:
        return user.payment_created_at;

      default:
        return '';
    }
  }

  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.selectedUsersPerPage = pageData.pageSize;
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  reset() {
    this.startDate = '';
    this.endDate = '';
    this.selectedGroupType = '';
    this.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  details: any;

  getDetails(details: any) {
    this.details = details;
    // this.display = "block";
  }

  isLoadingBtn: boolean = false;

  sendEmail() {
    this.isLoadingBtn = true;

    const userData = new FormData();

    userData.append('user_id', this.details?.user_id);

    switch (+this.selectedGroupType) {
      // Group Types 1-7
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        userData.append('amount', this.details?.loan_emi);
        userData.append('type', 'loan');
        userData.append('date', this.details?.payment_emi_date);
        break;

      // Group Type 8
      case 8:
        userData.append('amount', this.details?.payment_amount);
        userData.append('type', 'payment');
        userData.append('date', this.details?.payment_date);
        break;

      // Group Type 9
      case 9:
        userData.append('amount', this.details?.payment_amount);
        userData.append('type', 'Savings');
        userData.append('date', this.details?.monthly_payment_date);
        break;

      // Group Type 10
      case 10:
        userData.append('amount', this.details?.payment_amount);
        userData.append('type', 'SavingsJnr');
        userData.append('date', this.details?.monthly_payment_date);
        break;

      default:
        console.error('Invalid group type');
        return;
    }

    this.userService
      .postAPI('/sendOutstandingPaymentReminder', userData)
      .subscribe({
        next: (responseData: any) => {
          if (responseData.success == 0) {
            this.toastr.warning(responseData.message);
          } else {
            this.toastr.success(responseData.message);
          }

          this.isLoadingBtn = false;
          this.display = 'none';
          document.getElementById('closeBlock2')?.click();
        },

        error: (error) => {
          this.isLoadingBtn = false;
          this.display = 'none';
          this.toastr.error(
            error?.error?.message || 'Something went wrong. Please try again.'
          );
        }
      });
  }

  onClose(): void {
    this.display = "none";
  }


}
