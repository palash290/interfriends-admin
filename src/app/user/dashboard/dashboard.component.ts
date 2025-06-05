import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
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
  isLoadingCount1 = true;
  isLoadingCount2 = true;
  isLoadingCount3 = true;
  isLoadingCount4 = true;
  helpToBuyCar: string;
  hepToBuyHsc: string;
  totalSavingJnr: string;
  totalWelfare: string
  group: any[] = [];
  totalMiscellaneousAmount: any;
  totalDividendAmount: any;
  row_one: any;
  row_two: any;
  row_three: any;
  row_four: any;

  constructor(public authService: AuthService, public userService: UserService) { }

  ngOnInit(): void {
    this.adminId = this.authService.getUserId();
    // this.userService.dashbaord(this.adminId).subscribe((response: any) => {
    //   this.info = response.info;
    //   this.group = response.info.groups
    //   this.isLoadingCount = false;
    //   this.helpToBuyCar = response.info.helptobuycar.replace(',', '');
    //   this.hepToBuyHsc = response.info.help_to_buyHSc.replace(',', '');
    //   this.totalSavingJnr = response.info.savingJnrTotal.replace(',', '');
    //   this.totalWelfare = response.info.totalwelfare;
    //   this.totalMiscellaneousAmount = response.info.totalMiscellaneousAmount;
    //   this.totalDividendAmount = response.info.totalDividendAmount;
    // });

    this.userService.dashbaord1(this.adminId).subscribe({
      next: (response: any) => {
        this.isLoadingCount1 = false;
        this.row_one = response.info;
      },
      error: (err: any) => {
        this.isLoadingCount1 = false;
        console.error('Error fetching dashboard1 data:', err);
      }
    });


    this.userService.dashbaord2(this.adminId).subscribe({
      next: (response: any) => {
        this.isLoadingCount2 = false;
        this.row_two = response.info;
      },
      error: (err: any) => {
        this.isLoadingCount2 = false;
        console.error('Error fetching dashboard2 data:', err);
      }
    });


    this.userService.dashbaord3(this.adminId).subscribe({
      next: (response: any) => {
        this.isLoadingCount3 = false;
        this.row_three = response.info;
      },
      error: (err: any) => {
        this.isLoadingCount3 = false;
        console.error('Error fetching dashboard3 data:', err);
      }
    });

    this.userService.dashbaord4(this.adminId).subscribe({
      next: (response: any) => {
        this.isLoadingCount4 = false;
        this.row_four = response.info;
      },
      error: (err: any) => {
        this.isLoadingCount4 = false;
        console.error('Error fetching dashboard4 data:', err);
      }
    });


    // this.userService.dashbaord5(this.adminId).subscribe((response: any) => {
    //   this.isLoadingCount5 = false;
    //   this.row_five = response.info;
    // });

  }

  saveGroupname(groupName: string) {
    localStorage.setItem("GroupnameForUserList", groupName);
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }
}
