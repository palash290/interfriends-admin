import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../../../service/auth.service';
import { Dashboard } from 'src/app/model/dashboard.model';
import { GroupService} from '../../../service/group.service';

@Component({
  selector: 'app-grouped-user-detail',
  templateUrl: './grouped-user-detail.component.html',
  styleUrls: ['./grouped-user-detail.component.css']
})
export class GroupedUserDetailComponent implements OnInit {

  info: Dashboard;
  adminId: string;
  isLoadingCount = true;
  groupId: string;
  groupName : string;
  group : any[] = [];
  total_users : string;
  user_cycle : number;
  user_cycle_help_to_buy : number;
  user_cycle_jnr : number;


  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public groupService: GroupService)
     { }


  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      /*localStorage.setItem('groupId_interFriendAdmin', this.groupId )*/ });

     /*this.adminId = this.authService.getUserId();
      this.userService.dashbaord(this.adminId).subscribe((response: any) => {
        this.info = response.info;
        this.group = response.info.groups
        this.isLoadingCount = false;
      });*/
      this.groupService.group_detail(this.groupId)
      .subscribe((response: any) => {
        this.group =  response.groupDetail;
        this.groupName = response.groupDetail.group_cycle_name;
        this.total_users = response.total_users;
        this.user_cycle = parseInt(response.user_cycle.replace(",",""), 10) ;
        this.user_cycle_help_to_buy = parseInt(response.user_cycle_help_to_buy.replace(",",""), 10);
        this.user_cycle_jnr = parseInt(response.user_cycle_jnr.replace(",",""), 10);
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
