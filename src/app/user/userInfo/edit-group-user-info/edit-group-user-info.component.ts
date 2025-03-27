import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { SingleUserGroupList } from 'src/app/service/singleUserGroupList.service';
import { UserGroup } from 'src/app/model/userGroup.model';

@Component({
  selector: 'app-edit-group-user-info',
  templateUrl: './edit-group-user-info.component.html',
  styleUrls: ['./edit-group-user-info.component.css']
})
export class EditGroupUserInfoComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Input() groupId: string;

  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  userInfo: UserGroup;


  constructor(
    public authService: AuthService,
    public singleUserGroupList: SingleUserGroupList,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      jnr_amount: new FormControl(null, { validators: [Validators.required] }),
      expected_date: new FormControl(null, { validators: [Validators.required] })
    });
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
          this.singleUserGroupList.userGroupDetail(this.mainId)
          .subscribe((response: any) => {
            this.userInfo =  response.groupDetail;
            console.log(this.userInfo.amount, 'userInfo.amount')
            console.log(this.userInfo.expected_date, 'this.userInfo.expected_date')
            this.form.patchValue({
              amount: this.userInfo.amount,
              jnr_amount: this.userInfo.jnr_amount,
              expected_date: this.userInfo.expected_date,
            });
            this.isLoadingUpdate = false;
          });
      }
    }



    if (changes['add'] !== undefined) {
          if (changes['add'].currentValue !== undefined) {
            this.mode = 'create';
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

      // this.userOfGroupListService.addGroupCycle(
      //   this.groupId,
      //   this.form.value.start_date,
      //   this.form.value.month_count
      // ).subscribe((response: any) => {
      //   this.form.reset();
      //   document.getElementById('closePopup').click();
      //   this.isLoading = false;


      //   if (response.success === '1') {
      //     this.valueChange.emit('add');
      //     this.toastr.success(response.message);
      //   } else {
      //     this.toastr.error(response.message);
      //   }
      // });
    } else {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      this.singleUserGroupList.editUserGroup(
        this.userInfo.id,
        this.form.value.amount,
        this.form.value.expected_date,
        this.form.value.jnr_amount,
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopupEdit').click();
        this.isLoading = false;
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
    this.closeModal.emit("none")
  }

}
