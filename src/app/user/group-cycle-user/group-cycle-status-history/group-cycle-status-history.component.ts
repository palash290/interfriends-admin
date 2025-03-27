import { Component, OnInit } from '@angular/core';
import {GroupCycleService} from '../../../service/groupCycle.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { GroupCycleStatus } from 'src/app/model/groupCycleStatus.model';
import {Location} from '@angular/common';


@Component({
  selector: 'app-group-cycle-status-history',
  templateUrl: './group-cycle-status-history.component.html',
  styleUrls: ['./group-cycle-status-history.component.css']
})
export class GroupCycleStatusHistoryComponent implements OnInit {

  lists: GroupCycleStatus[] = [];
  cycleId: string;
  isLoading = true;

  constructor(
    public groupCycleService: GroupCycleService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.cycleId =paramMap.get('cycleId');
      // this.cycleId = '115';
      this.groupCycleService.userCycleStatusHistoryDetail(this.cycleId).subscribe((response: any) => {
        this.lists = response.cycleDetail;
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


  backClicked() {
    this._location.back()
  }


}
