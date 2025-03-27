import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { GroupCycle } from '../../../model/groupCycle.model';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { GroupCycleService } from '../../../service/groupCycle.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { userCycle } from 'src/app/model/userCycle.model';
import { CycleTotal } from 'src/app/model/cycleTotal.model';
import { UserGroupService } from 'src/app/service/userGroupList.service';
import { UserPaymentAmountCheckService } from 'src/app/service/userPaymentAmountCheck.service';

@Component({
  selector: 'app-group-cycle-user-list',
  templateUrl: './group-cycle-user-list.component.html',
  styleUrls: ['./group-cycle-user-list.component.css']
})
export class GroupCycleUserListComponent implements OnInit {

  lists: userCycle[] = [];
  totalInfo: CycleTotal;
  isLoadingTotal = true;
  isLoading = true;
  selectListStatusId: string;
  selectListId: string;
  groupId: string;
  userId: string;
  groupLifecycle_id: string;
  cycleList: GroupCycle[] = [];
  filterStartDate: string;
  filterEndDate: string;
  checkStatus = false;
  showPayoutButton = false;
  showPayoutMessage = '';
  showAlertMessage = false;
  showAlredyPayoutAlertMessage = false;
  isLoadingChangeCycle = false;
  lifeCycleType: string;
  pfNote: any;
  sfNote: any;
  form: FormGroup;
  firstname: string;
  lastname: string;
  useremail: string;
  amountCheck = new Subject;
  filteredButtons = false;
  // edit code start
  listId: string;
  updateId: string;
  eachChange: string;
  add: string;
  // edit code end
  display: string = 'none';
  display1: string = 'none';
  display2: string = 'none';

  constructor(
    public userService: UserService,
    public groupCycleService: GroupCycleService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private userAmountCheckService: UserPaymentAmountCheckService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.groupId = paramMap.get('groupId');
      this.userId = paramMap.get('userId');
      this.firstname = paramMap.get('firstname');
      this.lastname = paramMap.get('lastname');
      this.useremail = paramMap.get('email');
      if (paramMap.get('lifeCycleType')) {
        localStorage.setItem('lifeCycleType_interFriendAdmin', paramMap.get('lifeCycleType'));
      } else {
        localStorage.setItem('lifeCycleType_interFriendAdmin', '1');
      }
      this.checkStatus = false;
      this.lifeCycleType = localStorage.getItem('lifeCycleType_interFriendAdmin');
      this.groupCycleService.groupCycleAll_list(this.groupId, localStorage.getItem('lifeCycleType_interFriendAdmin')).subscribe((response: any) => {
        this.cycleList = response.lists;
        if (this.cycleList.length > 0) {
          this.filterStartDate = this.cycleList[0].start_date;
          this.filterEndDate = this.cycleList[0].end_date;
          const EndDate = new Date(this.filterEndDate)
          const current_date = new Date()

          if (current_date >= EndDate) {
            this.filteredButtons = true
          }

          this.groupLifecycle_id = this.cycleList[0].id;
          this.groupCycleService.showPayout(this.userId, this.groupLifecycle_id, this.groupId)
            .subscribe((response: any) => {
              this.showPayoutMessage = response.message;
              this.showPayoutButton = response.showButton;
              this.showAlertMessage = response.showAlertMessage;
              this.showAlredyPayoutAlertMessage = response.showAlreadyAlertMessage;
            });
          this.loadPayoutAmount();
          this.loadData();
        } else {
          this.lists = [];
          this.isLoading = false;
          this.isLoadingChangeCycle = false;
        }
      });
    });
    this.form = new FormGroup({
      loan_amount: new FormControl(null, { validators: [Validators.required] }),
      tenure: new FormControl('', { validators: [Validators.required] }),
      contact_number: new FormControl(null, { validators: [Validators.required] }),
      loan_type: new FormControl('', { validators: [Validators.required] }),
      created_at: new FormControl('', { validators: [Validators.required] }),
      interRate: new FormControl('', { validators: [Validators.required, Validators.pattern("^[0-9]*$")] }),
      document_image: new FormControl(null, {}),
      pay_date: new FormControl(null, {}),
      note_title: new FormControl(null, { validators: [Validators.required] }),
      note_description: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  loadPayoutAmount() {
    this.isLoadingTotal = true;
    this.userService.getCycleTotalAmount(this.userId, this.groupLifecycle_id, this.groupId)
      .subscribe((response: any) => {
        this.totalInfo = response.info;
        this.isLoadingTotal = false;
      });
  }

  checkAdminType() {
    if (localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

  loadData() {
    this.groupCycleService.showPayout(this.userId, this.groupLifecycle_id, this.groupId)
      .subscribe((response: any) => {
        this.showPayoutMessage = response.message;
        this.showPayoutButton = response.showButton;
        this.showAlertMessage = response.showAlertMessage;
        this.showAlredyPayoutAlertMessage = response.showAlreadyAlertMessage;

        this.groupCycleService.userSingleCycle(this.groupId, this.groupLifecycle_id, this.userId).subscribe((response: any) => {
          this.lists = response.groupCycleList;
          this.isLoading = false;
          this.isLoadingChangeCycle = false;
        });
      });
  }

  onSetId(id: string): void {
    if (this.selectListId === id) {
      this.selectListId = '';
    } else {
      this.selectListId = id;
    }
  }

  showModal() {

    this.display2 = "block";
  }

  showPayoutModal() {
    this.display1 = "block";
  }

  onAdd(): void {
    this.add = Math.random().toString();
    this.display = "block";
  }


  onUpdate(id: string, amount: any): void {
    this.userAmountCheckService.amountCheck.next(amount)
    this.amountCheck = amount;
    this.updateId = id;
    this.eachChange = Math.random().toString();
    this.display = "block";
  }

  hidePopup(): void {
    this.loadData();
  }

  onSetStatusId(id: string): void {
    if (this.selectListStatusId === id) {
      this.selectListStatusId = '';
    } else {
      this.selectListStatusId = id;
      console.log(this.selectListStatusId, 'this.selectListStatusId');
    }
  }




  updateStatus(id: string, status: string, index: number) {
    this.groupCycleService.editUserGroupCycleStatus(id, status)
      .subscribe((response: any) => {
        this.toastr.success(response.message);
        this.selectListStatusId = '';
        this.lists[index]['status'] = status;
      });
  }


  setCycle(cycleId: string, startDate: string, endDate: string) {
    this.groupLifecycle_id = cycleId;
    this.filterStartDate = startDate;
    this.filterEndDate = endDate;
    this.isLoadingChangeCycle = true;
    this.loadPayoutAmount();
    this.loadData();
  }

  checkCycleStatus(id: string) {
    // console.log(this.selectListStatusId, 'this.selectListId111');
    // console.log(id, 'this.selectListId2222');
    if (id === this.selectListStatusId) {
      return true;
    } else {
      return false;
    }
  }

  onCloseMessage() {
    this.showAlertMessage = false;
  }

  onCloseAlreadyMessage() {
    this.showAlredyPayoutAlertMessage = false;
  }

  onPayout() {
    console.log(this.pfNote, "-----==----==--==-=-=-=")
    this.groupCycleService.addPayout(this.userId, this.groupLifecycle_id, this.groupId, this.pfNote)
      .subscribe((response: any) => {
        if (response.success === '1') {
          this.toastr.success(response.message);
          this.pfNote = '';
        } else {
          this.toastr.error(response.message);
        }

        document.getElementById('closepayout').click();
        this.ngOnInit();
      })
  }


  onSafekeeping() {
    console.log("onSafekeeping");
    this.groupCycleService.addSafeKeeping(this.userId, this.groupLifecycle_id, this.groupId, this.sfNote)
      .subscribe((response: any) => {
        if (response.success === '1') {
          this.toastr.success(response.message);
          this.sfNote = '';
        } else {
          this.toastr.error(response.message);
        }

        document.getElementById('closesafekeeping').click();
        this.ngOnInit();
      })
  }


  closeModalF(event: any) {
    this.display = event;
  }

  onClose() {
    this.display1 = "none";
    this.display2 = "none";
  }
}
