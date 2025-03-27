import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { PfService} from '../../../service/pf.service';
import { UserService } from 'src/app/service/user.service';
import { Loan } from 'src/app/model/loan.model';

@Component({
  selector: 'app-pf-add',
  templateUrl: './pf-add.component.html',
  styleUrls: ['./pf-add.component.css']
})
export class PfAddComponent implements OnInit {

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


  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  loan: Loan;
  selectListStatusId: string;

  constructor(
    public authService: AuthService,
    public pfService: PfService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.adminType = this.authService.getAdminType();
    this.form = new FormGroup({
      amount: new FormControl(null, { validators: [Validators.required] }),
      payment_method: new FormControl(null, { validators: [Validators.required] }),
      note_title: new FormControl(null, { validators: [Validators.required] }),
      note_description: new FormControl(null, { validators: [Validators.required] }),
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

          // this.isLoadingUpdate = true;
          // this.mode = 'update';
          // this.loanService.loanDetail(this.mainId)
          // .subscribe((response: any) => {
          //   console.log(response.loanDetail, 'response.loanDetail');
          //   this.loan =  response.loanDetail;
          //   this.form.patchValue({
          //     loan_amount: this.loan.loan_amount,
          //     tenure: this.loan.tenure,
          //     contact_number: this.loan.contact_number,
          //     loan_type: this.loan.loan_type,
          //     status: this.loan.status
          //   });
          //   this.isLoadingUpdate = false;
          // });
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

    if (this.mode === 'create') {

      if (this.form.invalid) {
        return;
      }

      this.isLoading = true;

      this.pfService.addPF(
        this.userId,
        this.groupId,
        this.form.value.amount,
        this.form.value.payment_method,
        this.form.value.note_title,
        this.form.value.note_description
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
