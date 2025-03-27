import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { UserList } from 'src/app/model/userList.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-single-user-detail',
  templateUrl: './single-user-detail.component.html',
  styleUrls: ['./single-user-detail.component.css']
})



export class SingleUserDetailComponent implements OnInit {
  userId: string;
  groupId: string;
  user: UserList;
  isLoading = true;
  groupName : string;
  data : any;
  help2Buy : string;
  saving : string;
  savingJNR : string;
  payoutCycle : string;
  payoutCycleJnr : string;
  investment:string;
  dividend:string;
  emergencyLoan:string;
  misc:string;
  safekeeping:string;
  loans:string;
  avgAmountPf:string;
  welfare:string;
  overAllTotal: number = 0;

  constructor(
    public userService: UserService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get('userId');
      this.groupId = paramMap.get('groupId');
      this.groupName = localStorage.getItem('GroupnameForUserList')
      this.userService.getUserInfo(this.userId).subscribe((response: any) => {
        this.user = response.userinfo
        this.isLoading = false;
      });
      this.userService.userSpecDetails(this.userId, this.groupId).subscribe((response: any) => {
        console.log(response, "dd")
        this.help2Buy = response.Help2buy.replace(',','');
        this.saving = response.Saving.replace(',','');
        this.savingJNR = response.SavingJNR.replace(',','');
        this.payoutCycle = response.payoutCycle.replace(',','');
        this.payoutCycleJnr = response.payoutCyclejnr.replace(',','');
        this.investment = response.Investment.replace(',','');
        this.dividend = response.Dividend.replace(',','');
        this.emergencyLoan = response.Emergencyloan.replace(',','');
        this.misc = response.Miscellaneous.replace(',','');
        this.safekeeping = response.SafeKeeping.replace(',','');
        this.loans = response.Loans.replace(',','');
        this.avgAmountPf = response.avgAmountPf.replace(',','');
        this.welfare = response.avgwelfare.replace(',','');
        console.log(this.loans, "loans")
        console.log(this.investment, "investment")
        this.overAllTotal =
        this.overAllTotal +
        parseInt(this.saving) +
        parseInt(this.savingJNR) +
        parseInt(this.help2Buy) +
        parseInt(this.loans) +
        parseInt(this.safekeeping) +
        parseInt(this.avgAmountPf) +
        parseInt(this.investment) +
        parseInt(this.dividend) +
        parseInt(this.welfare) +
        parseInt(this.misc) +
        parseInt(this.emergencyLoan)
        console.log(this.overAllTotal,"overall")
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
