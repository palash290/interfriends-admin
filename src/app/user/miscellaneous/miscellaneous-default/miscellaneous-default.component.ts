import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { MiscellaneousService} from '../../../service/miscellaneous.service';
import { UserService } from 'src/app/service/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-miscellaneous-default',
  templateUrl: './miscellaneous-default.component.html',
  styleUrls: ['./miscellaneous-default.component.css']
})
export class MiscellaneousDefaultComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  adminType: string;
  @Input() userId: string;
  @Input() groupId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    public authService: AuthService,
    public miscellaneousService: MiscellaneousService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.adminType = this.authService.getAdminType();
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      start_date	: new FormControl(null, { validators: [Validators.required] }),
      title	: new FormControl(null, { validators: [Validators.required] }),
      description	: new FormControl(null, { validators: [Validators.required] }),
      tenure: new FormControl('', { validators: [Validators.required] }),
      note_title	: new FormControl(null, { validators: [Validators.required] }),
      note_description	: new FormControl(null, { validators: [Validators.required] }),
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
    console.log(this.form.value.payment_method, 'payment_method');

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;

      this.miscellaneousService.addMiscellaneous(
        this.userId,
        this.groupId,
        this.form.value.amount,
        this.form.value.start_date,
        '4',
        this.form.value.title,
        this.form.value.description,
        this.form.value.tenure,
        this.form.value.note_title,
        this.form.value.note_description
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopupAdd').click();
        this.isLoading = false;


        if (response.success === '1') {
          this.valueChange.emit('add');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    } else {
      // if (this.form.invalid) {
      //   return;
      // }
      // this.isLoading = true;
      // this.emergencyLoanService.editEmergencyLoan(
      //   this.loan.id,
      //   this.userId,
      //   this.groupId,
      //   this.form.value.loan_amount,
      //   this.form.value.start_date,
      //   this.form.value.status,
      //   this.form.value.note_title,
      //   this.form.value.note_description,
      //   this.form.value.payment_method,
      //   this.form.value.paid_status
      // ).subscribe((response: any) => {
      //   this.form.reset();
      //   document.getElementById('closePopupAdd').click();
      //   this.isLoading = false;
      //   if (response.success === '1') {
      //     this.valueChange.emit('update');
      //     this.toastr.success(response.message);
      //   } else {
      //     this.toastr.error(response.message);
      //   }
      // });
    }
  }



  onItemSelect(item:any){

  }

  OnItemDeSelect(item:any){

  }


  onClose(): void {
    this.form.reset();
    this.closeModal.emit("none")
  }

}
