import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { MiscellaneousStatusHistory } from 'src/app/model/miscellaneousStatusHistory.model';
import { MiscellaneousService } from 'src/app/service/miscellaneous.service';

@Component({
  selector: 'app-miscellaneous-status-history',
  templateUrl: './miscellaneous-status-history.component.html',
  styleUrls: ['./miscellaneous-status-history.component.css']
})
export class MiscellaneousStatusHistoryComponent implements OnInit {

  lists: MiscellaneousStatusHistory[] = [];
  miscellaneousId: string;
  isLoading = true;

  constructor(
    public userService: UserService,
    public miscellaneousService: MiscellaneousService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.miscellaneousId =paramMap.get('loanId');
      this.miscellaneousService.miscellaneousStatusHistoryDetail(this.miscellaneousId).subscribe((response: any) => {
        this.lists = response.miscellaneousDetail;
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
