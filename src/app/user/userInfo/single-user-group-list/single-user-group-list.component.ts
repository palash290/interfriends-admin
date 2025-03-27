import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap, Router} from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { SingleUserGroup } from 'src/app/model/singleUserGroup.model';



@Component({
  selector: 'app-single-user-group-list',
  templateUrl: './single-user-group-list.component.html',
  styleUrls: ['./single-user-group-list.component.css']
})
export class SingleUserGroupListComponent implements OnInit {

  lists: SingleUserGroup[] = [];
  userId: string;
  isLoading = true;
  groupId = '';

  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId =paramMap.get('userId');
      // this.cycleId = '115';
      this.userService.userGroupList(this.userId).subscribe((response: any) => {
        this.lists = response.lists;
        this.isLoading = false;

        this.router.navigate(['/user/singleUserDetail', this.userId, this.lists[0].group_id]);
      });
    });
  }

  checkGroupExist(group_id: string) {
      if(group_id === this.groupId) {
        return true;
      } else {
        return false;
      }
  }

  handleChange(evt: any, group_id: string) {
    var target = evt.target;
    if (target.checked) {
        this.groupId = group_id;
    } else {
      this.groupId = '';
    }
  }


  onSave() {
    if (this.groupId !== '') {
      this.router.navigate(['/user/singleUserDetail', this.userId, this.groupId]);
    } else {
      this.toastr.error('Please Select One Of Group');
    }
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

}
