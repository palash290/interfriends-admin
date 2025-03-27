import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/model/property.model';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationList } from 'src/app/model/notificationList.model';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  lists: NotificationList[] = [];
  userId: string;
  admin_type: string;
  user_type: string;
  groupId: string;
  isLoading  = true;

  pageLimit: number;
  notEmptyPost = true;
  notscrolly = true;
  isLoader = true;


  constructor(
    public uerService: UserService,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.admin_type = this.authService.getAdminType();
    if(this.admin_type === '1') {
      this.user_type = '2';
    } else {
      this.user_type = '1';
    }
    this.pageLimit = 0;
    this.notEmptyPost = true;
    this.notscrolly = true;
    this.isLoader = true;
    this.loadInitList();
  }


  // list code start

  loadInitList() {
    this.isLoader = true;
    this.pageLimit = 0;
    this.uerService.notificationList(
      this.pageLimit,
      this.userId,
      this.user_type
      ).subscribe((response: any) => {
        this.isLoader = false;
        this.isLoading = false;
        this.spinner.hide();
        if (response.lists.length === 0 ) {
          this.notEmptyPost =  false;
        }

        for (const value of response.lists) {
          this.lists.push(value);
        }
        console.log(this.lists)

        this.notscrolly = true;
     });
  }


  loadNextList() {
      this.pageLimit += 10;
      this.uerService.notificationList(
        this.pageLimit,
        this.userId,
        this.user_type
        ).subscribe((response: any) => {
          this.spinner.hide();
          if (response.lists.length === 0 ) {
            this.notEmptyPost =  false;
          }

          for (const value of response.lists) {
            this.lists.push(value);
          }

          this.notscrolly = true;
      });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyPost) {
      this.spinner.show();
      this.notscrolly = false;
      this.loadNextList();
     }
   }

  // list code end

}
