import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { LoanService} from '../../../service/loan.service';
import { UserService } from 'src/app/service/user.service';
import { Loan } from 'src/app/model/loan.model';

@Component({
  selector: 'app-add-loan-default',
  templateUrl: './add-loan-default.component.html',
  styleUrls: ['./add-loan-default.component.css']
})
export class AddLoanDefaultComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  adminType: string;
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Input() userId: string;
  @Input() groupId: string;

  loanType: string;


  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();

  loan: Loan;
  selectListStatusId: string;

  constructor(
    public authService: AuthService,
    public loanService: LoanService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.adminType = this.authService.getAdminType();
    this.form = new FormGroup({
      loan_amount: new FormControl(null, { validators: [Validators.required] }),
      tenure: new FormControl('', { validators: [Validators.required] }),
      contact_number: new FormControl(null, { validators: [Validators.required] }),
      loan_type: new FormControl('', { validators: [Validators.required] }),
      created_at: new FormControl('', { validators: [Validators.required] }),
      interRate: new FormControl('', { validators: [Validators.required, Validators.pattern("^[0-9]*$")] }),
      document_image: new FormControl(null, {}),
      pay_date: new FormControl(null, {}),
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


  onSelectType() {
      this.loanType = this.form.value.loan_type;
      console.log(this.loanType, 'this.loanType');
  }


  onImagePicked(event: Event): any {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ document_image: file });
    console.log(file, 'file');
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;

      this.loanService.addLoan(
        this.userId,
        this.groupId,
        this.form.value.loan_amount,
        this.form.value.tenure,
        this.form.value.contact_number,
        this.form.value.loan_type,
        this.form.value.document_image,
        this.form.value.pay_date,
        this.form.value.created_at,
        this.form.value.interRate,
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
      // this.loanService.editLoan(
      //   this.loan.id,
      //   this.userId,
      //   this.groupId,
      //   this.form.value.loan_amount,
      //   this.form.value.tenure,
      //   this.form.value.contact_number,
      //   this.form.value.loan_type,
      //   this.form.value.note_title,
      //   this.form.value.note_description,
      //   this.form.value.status
      // ).subscribe((response: any) => {
      //   this.form.reset();
      //   document.getElementById('closePopup').click();
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

  onClose(): void {
    this.form.reset();
    this.closeModal.emit("none");
  }
}
