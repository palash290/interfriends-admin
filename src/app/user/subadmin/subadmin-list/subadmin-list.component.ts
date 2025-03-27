import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubadminListService } from 'src/app/service/subadminList.service';
import { Subadmin } from 'src/app/model/subadmin.model';

@Component({
  selector: 'app-subadmin-list',
  templateUrl: './subadmin-list.component.html',
  styleUrls: ['./subadmin-list.component.css']
})
export class SubadminListComponent implements OnInit {

  @ViewChild(MatPaginator, { static : false} ) paginator: MatPaginator;
  users: Subadmin[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;
  isLoading = true;
  isLoadingPage = true;
  selectPlanId: string;
  search = '';

 // view detail
  updateId: string;
  eachChange: string;
  add: string;
  display : string = 'none';

  constructor(
    public userService: SubadminListService,
    private toastr: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
      this.usersSub = this.userService.getUserUpdateListener().subscribe(
        (userData: { users: Subadmin[]; userCount: number }) => {
        this.users = userData.users;
        this.totalUsers =  userData.userCount;
        this.isLoading = false;
        this.isLoadingPage = false;
      });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }


  onChangedPage(pageData: PageEvent): any {
    this.isLoadingPage = true;
    this.currentPage = pageData.pageIndex;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }


   // add edit code start

   onUpdate(id: string): void {
    this.updateId = id;
    this.eachChange = Math.random().toString();
    this.display = "block";
  }

  hidePopup(status: string): void {
    if (status === 'add') {
      this.ngOnInit();
    } else {
      this.onReload();
    }
  }

  onAdd(): void {
    this.add = Math.random().toString();
    this.display = "block";
  }

  onReload(): any {
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }


  // block and unblock code start
  onSetId(id: string): void {
    this.selectPlanId = id;
    this.display = "block";
  }

  onBlockUnblock(status: string): void {
      this.userService.blockUnblock(this.selectPlanId , status).subscribe((response: any) => {
        if (response.status === '1') {
          document.getElementById('closeUnblock').click();
        } else {
          document.getElementById('closeBlock').click();
        }
        this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
        this.toastr.success(response.message);
      });
  }


  onDelete(): void {
    this.userService.deleteSubAdmin(this.selectPlanId).subscribe((response: any) => {
      document.getElementById('closeDelete').click();
      this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
      this.toastr.success(response.message);
    });
}




  // search start
  keyPress(): any {
    if (this.users.length > 0) {
      this.paginator.pageIndex = 0;
    }
    this.currentPage = 0;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.search);
  }

  onClose(): void {
    this.display = "none";
  }


closeModalF(event : any) {
  this.display = event;
}
  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

}
