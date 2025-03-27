import { Component, OnDestroy, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { LoanPayment } from '../../../model/loanPayment.model';
import { Subscription } from 'rxjs';
import { LoanService} from '../../../service/loan.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
// import * as $ from 'jquery'
declare var $: any;

@Component({
  selector: 'app-loan-payment',
  templateUrl: './loan-payment.component.html',
  styleUrls: ['./loan-payment.component.css']
})
export class LoanPaymentComponent implements OnInit {
  lists: LoanPayment[] = [];
  isLoading = true;
  userId: string;
  groupId: string;
  loanId: string;
  totalPaidAmount: number;
  loanAmount: number;
  interest_rate: number;
  interest_payable: number;
  loanAmount_initital: number;
  guarantor : string;
  display : string = 'none';
  headerName:string;
  provident:number


  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public loanService: LoanService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId =paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.loanId = paramMap.get('loanId');;

      this.loanService.loanPaymentList(
        this.userId,
        this.groupId,
        this.loanId
      ).subscribe((response: any) => {
        this.lists = response.paymentList;
        this.totalPaidAmount = response.totalPaidAmount;
        this.loanAmount = response.loanAmount;
        this.interest_rate = response.interest_rate;
        this.interest_payable = response.interest_payable;
        this.loanAmount_initital = response.loanAmount_initital;
        this.guarantor = response.guranrantor;
        this.provident = response.provident;
        this.isLoading = false;
      });
  });

  this.getHeaderName()
  }



  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display= "block";
  }

  hidePopup(status: string): void {
    if (status === 'add') {
      this.ngOnInit();
    } else {
      this.ngOnInit();
    }
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
    this.display= "block";
  }

  sendMail(user_id : string, guarantor : string, loanAmount : string)
  {

    this.loanService.emailMissedPayment(
      user_id,
      guarantor,
      loanAmount
    ).subscribe((response: any) => {
       if (response.success == 0)
       {
           this.toastr.error(response.message);
       }
       else if(response.success == 1)
       {
        this.toastr.success(response.message);
       }
  });
}

closeModalF(event : any) {
  this.display = event;
}

  // add edit code end

    getHeaderName(){
    this.userService.loanHeaderName.subscribe((res:string)=>{
this.headerName = res
      console.log(res, "headr name")
    })
  }

//   ngOnDestroy() {
//     console.log("unsicrbe")
//     this.userService.loanHeaderName.unsubscribe() // <-------
// }

}
