import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserListService } from 'src/app/service/userList.service';
import { UserList } from '../../model/userList.model';
@Component({
  selector: 'app-block-user',
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.css']
})
export class BlockUserComponent implements OnInit {
  users: UserList[] = [];

  constructor(
    public userService: UserListService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    const searchkey: any = ''
    this.userService.userBlockRequestList(searchkey).subscribe((userData: { userList: UserList[]; userCount: number })=>{
      console.log(userData,"userData")
      this.users = userData.userList;
    })
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  onSetId(id : string , status : string){
this.userService.userBlockconfirm(id , status).subscribe((response : any)=>{
 
  this.toastr.success(response.message);
})
  }

}
