import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import { GroupCycle } from '../../model/groupCycle.model';
import { GroupCycleService} from '../../service/groupCycle.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Payout } from 'src/app/model/payout.model';


@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.css']
})
export class PayoutListComponent implements OnInit {

  lists: Payout[] = [];
  isLoading = true;
  selectListStatusId: string;
  selectListId: string;
  groupId: string;
  userId: string;
  groupLifecycle_id: string;
  cycleList: GroupCycle[] = [];
  filterStartDate: string;
  filterEndDate: string;
  isLoadingChangeCycle = false;
  lifeCycleType: string;

firstname : string;
lastname : string;
useremail : string
  constructor(
    public userService: UserService,
    public groupCycleService: GroupCycleService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.firstname = paramMap.get('firstname');
      this.lastname = paramMap.get('lastname');
      this.useremail = paramMap.get('email');
      if(paramMap.get('lifeCycleType')) {
        localStorage.setItem('lifeCycleType_interFriendAdmin', paramMap.get('lifeCycleType'));
      } else {
        localStorage.setItem('lifeCycleType_interFriendAdmin', '1');
      }

      this.lifeCycleType =  localStorage.getItem('lifeCycleType_interFriendAdmin');
      this.groupCycleService.groupCycleAll_list(this.groupId, localStorage.getItem('lifeCycleType_interFriendAdmin')).subscribe((response: any) => {
        this.cycleList = response.lists;
        if(this.cycleList.length > 0) {
          this.filterStartDate = this.cycleList[0].start_date;
          this.filterEndDate = this.cycleList[0].end_date;
          this.groupLifecycle_id = this.cycleList[0].id;
        }
        this.loadData();
      });
    });
  }

loadData() {
    this.groupCycleService.payoutDetail(this.groupId, this.groupLifecycle_id, this.userId).subscribe((response: any) => {
      this.lists = response.payoutCycle;
      this.isLoading = false;
      this.isLoadingChangeCycle = false;
    });
}

checkAdminType() {
  if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
    return true;
  } else {
    return false;
  }
}

  setCycle(cycleId: string, startDate: string, endDate: string) {
    this.groupLifecycle_id = cycleId;
    this.filterStartDate = startDate;
    this.filterEndDate = endDate;
    this.isLoadingChangeCycle = true;
    this.loadData();
  }

  checkCycleStatus(id: string) {
    if(id === this.selectListStatusId) {
      return true;
    } else {
      return false;
    }
  }
}
