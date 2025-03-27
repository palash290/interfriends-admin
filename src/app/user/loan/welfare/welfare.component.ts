import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { GroupCycle } from '../../../model/groupCycle.model';
import { Subject } from 'rxjs';
import { GroupCycleService} from '../../../service/groupCycle.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { userCycle } from 'src/app/model/userCycle.model';
import { CycleTotal } from 'src/app/model/cycleTotal.model';
import { UserPaymentAmountCheckService } from 'src/app/service/userPaymentAmountCheck.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { LoanService } from 'src/app/service/loan.service';
import { AuthService } from 'src/app/service/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-welfare',
  templateUrl: './welfare.component.html',
  styleUrls: ['./welfare.component.css'],
  providers: [DatePipe]
})
export class WelfareComponent implements OnInit {

  lists: [] = [];
  totalInfo: CycleTotal;
  isLoadingTotal = true;
  isLoading = true;
  selectListStatusId: string;
  selectListId: string;
  groupId: string;
  userId: string;
  groupLifecycle_id: string;
  cycleList: GroupCycle[] = [];
  filterStartDate: string;
  filterEndDate: string;
  checkStatus = false;
  showPayoutButton = false;
  showPayoutMessage = '';
  showAlertMessage = false;
  showAlredyPayoutAlertMessage = false;
  isLoadingChangeCycle = false;
  lifeCycleType: string;
  pfNote : any;
  sfNote : any;
  form: FormGroup;
  formUpdate : FormGroup;
firstname : string;
lastname : string;
useremail : string;
amountCheck  = new Subject;
  // edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  isLoadingUpdate : boolean = false;
  // edit code end
  loanType: string;
  display : string = 'none';
  display1 : string = 'none';
  loanTypeText : string;
  total40month : string;
  provident : string;
  monthlypayment : string
  adminrisk : string;
  loan_tenure : string;
  admin_id : string;

  payOutElem : any =  {1: "975.00", 2: "1950.00"};
  providentElem : any = { 1 : "0", 2 : "0"};
  AdminriskElem : any = { 1 : "25.00", 2 : "50"};
  totalPayElem : any = {1: "1000.00", 2 : "2000.00" };
  monthlyPayElem : any = {1 : "25.00", 2 : "50.00"};
  payout : string;
  newStatus : string;
  myDate : string;
  display2 : string = "none";
  display3 : string = "none";
  month : string;

  constructor(
    public userService: UserService,
    public groupCycleService: GroupCycleService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private userAmountCheckService : UserPaymentAmountCheckService,
    public loanService : LoanService,
    public authService: AuthService,
    private datePipe: DatePipe,
    public auth : AuthService
  ) {
    this.myDate = (new Date()).toString();
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.admin_id = this.auth.getUserId();

      this.checkStatus = false;
        this.groupCycleService.groupCycleAll_list(this.groupId, '4').subscribe((response: any) => {
        this.cycleList = response.lists;
        if(this.cycleList.length > 0) {
          this.filterStartDate = this.cycleList[this.cycleList.length-1].start_date;
          this.filterEndDate = this.cycleList[this.cycleList.length-1].end_date;
          this.groupLifecycle_id = this.cycleList[this.cycleList.length-1].id;
          this.loanService.welfareList(this.groupId, this.userId, this.groupLifecycle_id ).subscribe((response: any) => {
          this.lists = response.lists;
          this.isLoading = false;
          this.isLoadingChangeCycle = false;
      });
       this.groupCycleService.showStatus(this.userId, this.groupLifecycle_id, this.groupId)
       .subscribe((response: any) => {
         this.showPayoutMessage = response.message;
        this.showPayoutButton = response.showButton;
        this.showAlertMessage = response.showAlertMessage;
        this.showAlredyPayoutAlertMessage = response.showAlreadyAlertMessage;
       });

        } else {
          this.lists = [];
          this.isLoading = false;
          this.isLoadingChangeCycle = false;
        }
      });
    });

    this.form = new FormGroup({
      loan_amount: new FormControl(null, { validators: [Validators.required] }),
      tenure	: new FormControl('', { validators: [Validators.required] }),
      emi	: new FormControl(null, {}),
      pay_date: new FormControl(null, {}),
      adminrisk : new FormControl(null, {}),
      total40Months : new FormControl(null, {}),
      provident : new FormControl(null, {}),
      admin_risk : new FormControl(null, {}),

    });

    this.formUpdate = new FormGroup({
      status: new FormControl(null, { validators: [Validators.required] }),
      note: new FormControl(null, {}),
      note_description : new FormControl(null, {}),
      start_date : new FormControl(null, { validators: [Validators.required] }),
      month : new FormControl(null, { validators: [Validators.required] }),
      payment_method :  new FormControl(null, { validators: [Validators.required] }),
      amount : new FormControl(null, { validators: [Validators.required] })
          });
  }

  showModalAdd()
  {
    this.display = "block";
  }

  showModal(){
    this.display2 = "block";
    this.isLoadingTotal = true;
    this.userService.getCycleTotalAmountPayout(this.userId, this.groupLifecycle_id, this.groupId)
          .subscribe((response: any) => {
            this.totalInfo = response.info;
            this.isLoadingTotal = false;
        });
  }

  showModalsafe(){
    this.display3 = "block";
    this.isLoadingTotal = true;
    this.userService.getCycleTotalAmount(this.userId, this.groupLifecycle_id, this.groupId)
          .subscribe((response: any) => {
            this.totalInfo = response.info;
            this.isLoadingTotal = false;
        });
  }

  onAdd(): void {
    this.add = Math.random().toString();
  }


  onUpdate(list : any): void {
    this.updateId = list.id;
    this.payout = list.amount;
    this.formUpdate.patchValue({ amount : this.payout });
    this.formUpdate.patchValue({ start_date : list.date});
    this.formUpdate.patchValue({month : list.month});
    this.formUpdate.patchValue({payment_method : list.payment_method});
    this.formUpdate.patchValue({status : list.status});
    this.provident = list.provident;
    this.adminrisk = list.admin_risk;
    this.monthlypayment = list.loan_emi;
    this.total40month = list.total_payment;
    this.eachChange = Math.random().toString();
    this.display1 = "block";
    this.isLoading = false;
    this.month = list.month;
  }

  onClose() {
    this.form.reset();
    this.display = "none";
    this.display1 = "none";
    this.display2 = "none";
    this.display3 = "none";
    this.form.patchValue({
      tenure: '',
      gurarantor: '',
      loan_amount : '',
      total40Months : '',
      provident : '',
      admin_risk : '',
      pay_date : '',
      emi : ''
    });
  }


findkey(total_payment : string)
{
  return Object.keys(this.payOutElem).find(key => this.payOutElem[key] === total_payment);
}


onInputAmount(eventData: string): void {

    if(eventData) {
      console.log('hellowwwwww', eventData);
      let total_payment = eventData;
      let key = this.findkey(total_payment);
      this.payout = total_payment;
      this.provident = this.providentElem[key];
      this.adminrisk = this.AdminriskElem[key]
      this.monthlypayment = this.monthlyPayElem[key];
      this.total40month = this.totalPayElem[key];
      this.form.patchValue({ tenure : '40'});
    }
 }


 selectStatus(eventData : string): void {
  console.log("eventData", eventData)
  if(eventData) {
      this.newStatus = eventData;
  }
 }

 onSave(): void {
  console.log(this.form)
  this.form.markAllAsTouched();
  if (this.form.invalid) {
    return;
  }

  this.isLoading = true;

  this.loanService.requestWelfare(
    this.userId,
    this.groupId,
    this.form.value.emi,
    this.form.value.tenure,
    this.form.value.total40Months,
    this.form.value.provident,
    this.form.value.admin_risk,
    this.form.value.emi,
   this.form.value.pay_date,
   this.groupLifecycle_id
  ).subscribe((response: any) => {
      this.form.reset();
      document.getElementById('closePopupLoanRequest').click();
      this.isLoading = false;
      if (response.success === '1') {

        this.toastr.success(response.message);
        this.lists =[];
        this.loanService.welfareList(this.groupId, this.userId, this.groupLifecycle_id).subscribe((response: any) => {
          this.lists = response.lists;
        });

      } else {
        this.toastr.error(response.message);
      }
    });
  this.display = 'none';
}

onSaveUpdate(): void {
  this.formUpdate.markAllAsTouched();
    if (this.formUpdate.invalid) {
      this.toastr.error("Please fill up all the fields");
      return;
    }
    this.isLoading = true;
    this.loanService.editWelfare(
      this.updateId,
      this.userId,
      this.admin_id,
      this.groupId,
      this.formUpdate.value.amount,
      this.formUpdate.value.month,
      this.formUpdate.value.note,
      this.formUpdate.value.note_description,
      this.newStatus,
      this.formUpdate.value.start_date,
      this.formUpdate.value.payment_method
    ).subscribe((response: any) => {
      this.formUpdate.reset();

      this.isLoading = false;
      if (response.success === '1') {

        this.toastr.success(response.message);
        this.lists =[];
        this.display1 = "none";
        this.loanService.welfareList(this.groupId, this.userId, this.groupLifecycle_id).subscribe((response: any) => {
        this.lists = response.lists;
        this.isLoading = false;
        this.isLoadingChangeCycle = false;
        });

      } else {
        this.toastr.error(response.message);
      }
    });
}


onSafekeeping()
{
  console.log("onSafekeeping");
  this.loanService.addSafeKeeping(
    this.userId,
    this.admin_id,
    this.groupId,
    this.formUpdate.value.note,
    this.groupLifecycle_id
  ).subscribe((response: any) => {
    this.formUpdate.reset();

    this.isLoading = false;
    if (response.success === '1') {

      this.toastr.success(response.message);
      this.lists =[];
      this.display3 = "none";
      this.loanService.welfareList(this.groupId, this.userId, this.groupLifecycle_id).subscribe((response: any) => {
      this.lists = response.lists;
      this.isLoading = false;
      this.isLoadingChangeCycle = false;
      this.showPayoutButton = false;
      });

    } else {
      this.toastr.error(response.message);
    }
  });
}


onPayout()
{
  console.log("onSafekeeping");
  this.loanService.addPayoutwelfareCycle(
    this.userId,
    this.admin_id,
    this.groupId,
    this.formUpdate.value.note,
    this.groupLifecycle_id
  ).subscribe((response: any) => {
    this.formUpdate.reset();

    this.isLoading = false;
    if (response.success === '1') {

      this.toastr.success(response.message);
      this.lists =[];
      this.display1 = "none";
      this.loanService.welfareList(this.groupId, this.userId, this.groupLifecycle_id).subscribe((response: any) => {
      this.lists = response.lists;
      this.isLoading = false;
      this.display2 = "none";
      this.isLoadingChangeCycle = false;
      this.showPayoutButton = false;
      });

    } else {
      this.toastr.error(response.message);
    }
  });
}

}

