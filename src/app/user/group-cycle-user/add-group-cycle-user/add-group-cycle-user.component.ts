import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { GroupCycleService} from '../../../service/groupCycle.service';
import { UserService } from 'src/app/service/user.service';
import { userCycle } from 'src/app/model/userCycle.model';
import { UserPaymentAmountCheckService } from 'src/app/service/userPaymentAmountCheck.service';

@Component({
  selector: 'app-add-group-cycle-user',
  templateUrl: './add-group-cycle-user.component.html',
  styleUrls: ['./add-group-cycle-user.component.css']
})
export class AddGroupCycleUserComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() userId: string;
  @Input() groupLifecycle_id: string;
  @Input() groupId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Input() amountCheck: any;
  adminType : any
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  group: userCycle;
  isDisabled : boolean = false;
amount : any
  constructor(
    public authService: AuthService,
    public groupCycleService: GroupCycleService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private userPaymentCheckService : UserPaymentAmountCheckService
  ) { }

  ngOnInit(): void {

    this.mode = 'create';
    this.form = new FormGroup({
      start_date: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, { validators: [Validators.required] }),
      note: new FormControl('', { validators: [Validators.required] }),
      note_description: new FormControl('', { validators: [Validators.required] }),
      month: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl(null, { validators: [Validators.required] }),
      payment_method: new FormControl(null, { validators: [Validators.required] }),
    });

   this.adminType = localStorage.getItem('admin_type_interFriendAdmin')
  this.userPaymentCheckService.amountCheck.subscribe((amount : any)=>{

   if(this.adminType == '1' && amount == 0.00){
    console.log(this.adminType, "==", amount)
     this.isDisabled = false
   }else{
    this.isDisabled = true;
   }
})

  }


  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return false;
    } else {
      return true;
    }
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    if (changes['uniqueId'] !== undefined || changes['eachChange'] !== undefined) {
      if (changes['eachChange'].currentValue !== undefined) {
          if (changes['uniqueId'] === undefined) {
            this.mainId = this.mainId;
          } else if (changes['uniqueId'].currentValue !== undefined) {
            this.mainId = changes['uniqueId'].currentValue;
          } else {
            this.mainId = this.mainId;
          }

          this.isLoadingUpdate = true;
          this.mode = 'update';
          this.groupCycleService.userGroupCycle(this.mainId)
          .subscribe((response: any) => {
            this.group =  response.groupDetail;
            this.form.patchValue({
              start_date: this.group.date,
              amount: this.group.amount,
              month: this.group.month,
              status: this.group.status,
              payment_method: this.group.payment_method
            });
            this.isLoadingUpdate = false;
          });
      }
    }



    if (changes['add'] !== undefined) {
          if (changes['add'].currentValue !== undefined) {
            this.mode = 'create';
            this.form.patchValue({
              status: '1',
            });
          }
    }

  }

  onSave(): void {
    this.form.markAllAsTouched();
    // console.log(this.form.invalid);
    console.log(this.form.value.members, 'selectedItems');

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;

      this.groupCycleService.adduserGroupCycle(
        this.groupId,
        this.groupLifecycle_id,
        this.userId,
        this.form.value.amount,
        this.form.value.note,
        this.form.value.note_description,
        this.form.value.start_date,
        this.form.value.month,
        this.form.value.status,
        this.form.value.payment_method
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;
        this.group = undefined;
        if (response.success === '1') {
          this.valueChange.emit('add');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    } else {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      this.groupCycleService.editUserGroupCycle(
        this.group.id,
        this.userId,
        this.groupId,
        this.form.value.amount,
        this.form.value.note,
        this.form.value.note_description,
        this.form.value.start_date,
        this.form.value.month,
        this.form.value.status,
        this.form.value.payment_method
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;
        this.group = undefined;
        if (response.success === '1') {
          this.valueChange.emit('update');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }

  onClose(): void {
    this.form.reset();
    this.group = undefined;
    this.closeModal.emit("none")
  }

}
