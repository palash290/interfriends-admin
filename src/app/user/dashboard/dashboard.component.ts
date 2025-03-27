import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from 'src/app/model/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  info: Dashboard;
  adminId: string;
  isLoadingCount = true;
  helpToBuyCar : string;
  hepToBuyHsc : string;
  totalSavingJnr : string;
  totalWelfare : string
  group : any[] = [];
  constructor(
    public authService: AuthService,
    public userService: UserService,
    private toastr: ToastrService
    ) {}

    ngOnInit(): void {
      this.adminId = this.authService.getUserId();
      this.userService.dashbaord(this.adminId).subscribe((response: any) => {
        this.info = response.info;
        this.group = response.info.groups
        this.isLoadingCount = false;
        this.helpToBuyCar = response.info.helptobuycar.replace(',','');
        this.hepToBuyHsc = response.info.help_to_buyHSc.replace(',','');
        this.totalSavingJnr = response.info.savingJnrTotal.replace(',','');
        this.totalWelfare = response.info.totalwelfare;
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
