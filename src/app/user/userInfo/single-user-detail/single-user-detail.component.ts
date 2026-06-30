import { Component, OnInit } from '@angular/core';
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
  total_credit_score: any;
  trustScoreBand: string = 'Unknown';
  trustScoreRange: string = 'Overall trust indicator';
  trustScoreClass: string = 'color-grey';

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
        this.user = response.userinfo;
        this.total_credit_score = this.user.total_credit_score;
        this.setTrustScoreBand(this.total_credit_score);
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

  setTrustScoreBand(score: any): void {
    const value = Number(score);

    if (Number.isNaN(value)) {
      this.trustScoreBand = 'Unknown';
      this.trustScoreRange = 'Overall trust indicator';
      this.trustScoreClass = 'color-grey';
      return;
    }

    if (value <= 650) {
      this.trustScoreBand = 'Caution';
      this.trustScoreRange = '0 - 650';
    } else if (value <= 700) {
      this.trustScoreBand = 'Poor';
      this.trustScoreRange = '651 - 700';
    } else if (value <= 800) {
      this.trustScoreBand = 'Fair';
      this.trustScoreRange = '701 - 800';
    } else if (value <= 850) {
      this.trustScoreBand = 'Good';
      this.trustScoreRange = '801 - 850';
    } else if (value <= 1200) {
      this.trustScoreBand = 'Excellent';
      this.trustScoreRange = '851 - 1200';
    } else if (value <= 1300) {
      this.trustScoreBand = 'Exemplary';
    } else if (value <= 1600) {
      this.trustScoreBand = 'Exemplary';
    } else if (value <= 1650) {
      this.trustScoreBand = 'Very Important Person';
    } else {
      this.trustScoreBand = 'Unknown';
      this.trustScoreRange = 'Overall trust indicator';
    }

    this.trustScoreClass = this.getClassOf(this.trustScoreBand);
  }

  getClassOf(val: string) {
    if (val === 'Caution') {
      return 'color-red';
    } else if (val === 'Poor') {
      return 'color-orange';
    } else if (val === 'Fair') {
      return 'color-grey';
    } else if (val === 'Good') {
      return 'color-gold';
    } else if (val === 'Excellent') {
      return 'color-green';
    } else if (val === 'Exemplary') {
      return 'color-blue';
    } else if (val === 'Very Important Person' || val === 'Very Important person') {
      return 'color-rhodium';
    } else {
      return 'color-grey';
    }
  };

}
