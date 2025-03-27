import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { EmergencyLoanService} from '../../../service/emergencyLoan.service';
import { EmergencyLoan } from 'src/app/model/emergencyLoan.model';
import { UserService } from 'src/app/service/user.service';
import { AllUser } from 'src/app/model/allUser.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-emergency-loan-add',
  templateUrl: './emergency-loan-add.component.html',
  styleUrls: ['./emergency-loan-add.component.css']
})
export class EmergencyLoanAddComponent implements OnInit {

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
  @Output()  closeModal1: EventEmitter < string > = new EventEmitter < string > ();

  loan: EmergencyLoan;
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
    public emergencyLoanService: EmergencyLoanService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.adminType = this.authService.getAdminType();
    this.form = new FormGroup({
      loan_amount: new FormControl(null, { validators: [Validators.required] }),
      pay_by	: new FormControl(null, { validators: [Validators.required] }),
      status	: new FormControl(null, { validators: [Validators.required] }),
      note_title	: new FormControl(null, { validators: [Validators.required] }),
      note_description	: new FormControl(null, { validators: [Validators.required] }),
      created_at: new FormControl(null, { validators: [Validators.required] }),
      payment_method: new FormControl(null, { }),
      paid_status: new FormControl(null, { })
    });
  }


  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    console.log("changes========>", changes)
    if (changes['uniqueId'] !== undefined || changes['eachChange'] !== undefined) {
      if (changes['eachChange'].currentValue !== undefined) {
          if (changes['uniqueId'] === undefined) {
            this.mainId = this.mainId;
          } else if (changes['uniqueId'].currentValue !== undefined) {
            this.mainId = changes['uniqueId'].currentValue;
          } else {
            this.mainId = this.mainId;
          }
console.log("update mode on")
          this.isLoadingUpdate = true;
          this.mode = 'update';
          this.emergencyLoanService.emergencyLoan_detail(this.mainId)
          .subscribe((response: any) => {
            this.loan =  response.emergencyLoanDetail;
            this.form.patchValue({
              loan_amount: this.loan.loan_amount,
              pay_by: this.loan.pay_by,
              status: this.loan.status,
              payment_method: this.loan.payment_method,
              paid_status: this.loan.paid_status,
              created_at: this.loan.created_at
            });
            this.isLoadingUpdate = false;
          });
      }
    }



    if (changes['add'] !== undefined) {
      console.log("added changes")
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

      // if (this.form.invalid) {
      //   return;
      // }

      // this.isLoading = true;

      // this.emergencyLoanService.addEmergencyLoan(
      //   this.userId,
      //   this.groupId,
      //   this.form.value.loan_amount,
      //   this.form.value.pay_by,
      //   this.form.value.status,
      //   this.form.value.payment_method,
      //   this.form.value.paid_status
      // ).subscribe((response: any) => {
      //   this.form.reset();
      //   document.getElementById('closePopup').click();
      //   this.isLoading = false;


      //   if (response.success === '1') {
      //     // this.valueChange.emit('add');
      //     this.router.navigate(['/user/UserGroupAddList',response.group_id]);
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
      this.emergencyLoanService.editEmergencyLoan(
        this.loan.id,
        this.userId,
        this.groupId,
        this.form.value.loan_amount,
        this.form.value.pay_by,
        this.form.value.status,
        this.form.value.note_title,
        this.form.value.note_description,
        this.form.value.payment_method,
        this.form.value.paid_status,
        this.form.value.created_at
      ).subscribe({
next: (response: any) => {
        console.log("response =====>", response)
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;
        if (response.success === '1') {
          this.valueChange.emit('update');
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      },
      error:(err:any)=>{
console.log("errr---->", err)
      }
    });
    }
  }



  onItemSelect(item:any){

  }

  OnItemDeSelect(item:any){

  }


  onClose(): void {
    this.form.reset();
    this.closeModal1.emit("none");
  }

}
