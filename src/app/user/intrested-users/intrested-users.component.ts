import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserList } from 'src/app/model/userList.model';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-intrested-users',
  templateUrl: './intrested-users.component.html',
  styleUrls: ['./intrested-users.component.css']
})
export class IntrestedUsersComponent implements OnInit {

  users: UserList[] = [];

  constructor(
    public userService: UserListService,
    public sharedService: SharedService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const searchkey: any = ''
    this.sharedService.getApi('/interested_user_list').subscribe({
      next: (resp) => {
        this.users = resp.interestedUser;
      },
      error: (error) => {
        console.error('Login error:', error.message);
      }
    });
  }

  updateId: string;
  user: any;

  onUpdateView(user: any): void {
    this.updateId = user.user_id;
    this.user = user;
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


}
