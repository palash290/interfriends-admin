import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { LoanService} from '../../../service/loan.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { LoanStatusHistory } from 'src/app/model/loanStatusHistory.model';


@Component({
  selector: 'app-loan-status-history',
  templateUrl: './loan-status-history.component.html',
  styleUrls: ['./loan-status-history.component.css']
})
export class LoanStatusHistoryComponent implements OnInit {

  lists: LoanStatusHistory[] = [];
  loanId: string;
  isLoading = true;

  constructor(
    public userService: UserService,
    public loanService: LoanService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.loanId =paramMap.get('loanId');
      // this.loanId = '5';
      this.loanService.loanStatusHistoryDetail(this.loanId).subscribe((response: any) => {
        this.lists = response.loanDetail;
        this.isLoading = false;
      });
    });
  }


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

}
