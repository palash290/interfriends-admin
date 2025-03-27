import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { LoanService} from '../../../service/loan.service';
import { LoanPayment } from 'src/app/model/loanPayment.model';
import { UserService } from 'src/app/service/user.service';
import { AllUser } from 'src/app/model/allUser.model';
import { MiscellaneousService } from 'src/app/service/miscellaneous.service';

@Component({
  selector: 'app-add-miscellaneous-payment',
  templateUrl: './add-miscellaneous-payment.component.html',
  styleUrls: ['./add-miscellaneous-payment.component.css']
})
export class AddMiscellaneousPaymentComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Input() groupId: string;
  @Input() userId: string;
  @Input() loanId: string;
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  loan: LoanPayment;

  constructor(
    public authService: AuthService,
    public loanService: MiscellaneousService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      status: new FormControl(null, { validators: [Validators.required] }),
      created_at: new FormControl(null, { validators: [Validators.required] }),
      note_title	: new FormControl(null, { validators: [Validators.required] }),
      note_description	: new FormControl(null, { validators: [Validators.required] }),
      payment_method: new FormControl(null, { validators: [Validators.required] }),
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
          this.loanService.miscellaneousPaymentDetail(this.mainId)
          .subscribe((response: any) => {
            this.loan =  response.paymentDetail;
            this.form.patchValue({
              amount: this.loan.amount,
              note_title: this.loan.note_title,
              note_description: this.loan.note_description,
              payment_method: this.loan.payment_method
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

      this.loanService.addMiscellaneousPayment(
        this.userId,
        this.groupId,
        this.loanId,
        this.form.value.amount,
        this.form.value.note_title,
        this.form.value.note_description,
        this.form.value.payment_method,
        this.form.value.status,
        this.form.value.created_at
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;


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
      this.loanService.editMiscellaneousPayment(
        this.loan.id,
        this.userId,
        this.groupId,
        this.form.value.amount,
        this.form.value.note_title,
        this.form.value.note_description,
        this.form.value.payment_method,
        this.form.value.status,
        this.form.value.created_at
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
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
    this.closeModal.emit("none");
  }
}
