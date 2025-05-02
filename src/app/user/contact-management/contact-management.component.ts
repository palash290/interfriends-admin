import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserList } from 'src/app/model/userList.model';
import { SharedService } from 'src/app/service/shared.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-contact-management',
  templateUrl: './contact-management.component.html',
  styleUrls: ['./contact-management.component.css']
})
export class ContactManagementComponent implements OnInit {

  users: UserList[] = [];

  constructor(
    public userService: UserListService,
    public sharedService: SharedService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const searchkey: any = ''
    this.sharedService.getApi('/contact_us_list').subscribe({
      next: (resp) => {
        this.users = resp.contactList;
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
