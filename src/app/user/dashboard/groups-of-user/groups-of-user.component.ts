import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from 'src/app/model/dashboard.model';
@Component({
  selector: 'app-groups-of-user',
  templateUrl: './groups-of-user.component.html',
  styleUrls: ['./groups-of-user.component.css']
})
export class GroupsOfUserComponent implements OnInit {

  constructor(  public authService: AuthService,
    public userService: UserService,
    private toastr: ToastrService) { }
    info: Dashboard;
    adminId: string;
    group_name : string;
    isLoadingCount = true;
    group : any[] = [];
    ngOnInit(): void {

    this.adminId = this.authService.getUserId();
    this.userService.dashbaord(this.adminId).subscribe((response: any) => {
      this.info = response.info;
      this.group = response.info.groups
      this.isLoadingCount = false;
    });

  }

  saveGroupname(groupName :string){
    localStorage.setItem("GroupnameForUserList", groupName);
   }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


}
