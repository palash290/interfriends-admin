import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/model/group.model';
import { UserList } from 'src/app/model/userList.model';
import { AuthService } from 'src/app/service/auth.service';
import { GroupService } from 'src/app/service/group.service';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-my-circle',
  templateUrl: './my-circle.component.html',
  styleUrls: ['./my-circle.component.css']
})
export class MyCircleComponent implements OnInit {

  isLoading = true;
  isLoadingPage = true;
  lists: Group[] = [];
  groupID: any = '22';

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public groupService: GroupService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCircleList()
    //this.adminType = this.authService.getAdminType();
  };

  getCircleList() {
    const formData = new FormData();
    formData.append('group_id', this.groupID);
    this.groupService.postAPI('/getCircleBygroupid', formData).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.isLoading = false;
          this.isLoadingPage = false;
          this.lists = res.data;
        } else {
          this.isLoading = false;
          this.isLoadingPage = false;
        }
      }
    })
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


}
