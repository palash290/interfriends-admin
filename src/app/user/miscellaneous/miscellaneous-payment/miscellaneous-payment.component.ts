import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { MiscellaneousPayment } from '../../../model/miscellaneousPayment.model';
import { Subscription } from 'rxjs';
import { LoanService} from '../../../service/loan.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { MiscellaneousService } from 'src/app/service/miscellaneous.service';

@Component({
  selector: 'app-miscellaneous-payment',
  templateUrl: './miscellaneous-payment.component.html',
  styleUrls: ['./miscellaneous-payment.component.css']
})
export class MiscellaneousPaymentComponent implements OnInit {

  lists: MiscellaneousPayment[] = [];
  isLoading = true;
  userId: string;
  groupId: string;
  loanId: string;
  totalPaidAmount: number;
  loanAmount: number;
  loanAmount_initital: number;
  display : string = 'none';

  // add edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // add edit code end

  constructor(
    public userService: UserService,
    public miscellaneousService: MiscellaneousService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId =paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.loanId = paramMap.get('loanId');;

      this.miscellaneousService.loanMiscellaneousPaymentList(
        this.userId,
        this.groupId,
        this.loanId
      ).subscribe((response: any) => {
        this.lists = response.paymentList;
        this.totalPaidAmount = response.totalPaidAmount;
        this.loanAmount = response.loanAmount;
        this.loanAmount_initital = response.loanAmount_initital;
        this.isLoading = false;
      });
  });
  }



  // add edit code start

  onUpdate(id: string): void {
    this.updateId = id;
    console.log(id, 'idddddd');
    this.eachChange = Math.random().toString();
    this.display = "block";
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
    this.display = "block";
  }

  // add edit code end
  closeModalF(event : any) {
    this.display = event;
  }

}
