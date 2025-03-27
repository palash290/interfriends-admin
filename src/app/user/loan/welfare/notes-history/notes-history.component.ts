import { Component, OnInit } from '@angular/core';
import {GroupCycleService} from '../../../../service/groupCycle.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { GroupCycleStatus } from 'src/app/model/groupCycleStatus.model';
import {Location} from '@angular/common';

@Component({
  selector: 'app-notes-history',
  templateUrl: './notes-history.component.html',
  styleUrls: ['./notes-history.component.css']
})
export class NotesHistoryComponent implements OnInit {

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
      this.groupCycleService.welfareStatusHistoryDetail(this.cycleId).subscribe((response: any) => {
        this.lists = response.loanDetail;
        this.isLoading = false;
      });
    });
  }



  backClicked() {
    this._location.back()
  }


}
