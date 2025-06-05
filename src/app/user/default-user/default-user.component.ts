import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserList } from 'src/app/model/userList.model';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-default-user',
  templateUrl: './default-user.component.html',
  styleUrls: ['./default-user.component.css']
})
export class DefaultUserComponent implements OnInit {

  users: UserList[] = [];

  constructor(
    public userService: UserListService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const searchkey: any = ''
    this.userService.userDefaultList(searchkey).subscribe((userData: { userList: UserList[]; userCount: number }) => {
      console.log(userData, "userData")
      this.users = userData.userList;
    })
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onSetId(id: string, status: string) {
    this.userService.userDefaultConfirm(id, status).subscribe((response: any) => {

      this.toastr.success(response.message);
    })

        this.userService.userDefaultList('').subscribe((userData: { userList: UserList[]; userCount: number }) => {
      this.users = userData.userList;
    })
  }


}
