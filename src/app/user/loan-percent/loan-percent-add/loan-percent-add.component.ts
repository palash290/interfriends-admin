import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { Loanpercent } from 'src/app/model/loanpercent.model';
import { LoanpercentService } from 'src/app/service/loanpercent.service';

@Component({
  selector: 'app-loan-percent-add',
  templateUrl: './loan-percent-add.component.html',
  styleUrls: ['./loan-percent-add.component.css']
})
export class LoanPercentAddComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  loanPercent: Loanpercent;


  constructor(
    public authService: AuthService,
    public loanpercentService: LoanpercentService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      percent	: new FormControl(null, { validators: [Validators.required] })
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
          this.loanpercentService.loan_percent_detail(this.mainId)
          .subscribe((response: any) => {
            this.loanPercent =  response.loanDetail;
            this.form.patchValue({
              title: this.loanPercent.title,
              percent: this.loanPercent.percent
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

      this.loanpercentService.addLoan_percent(
        this.form.value.title,
        this.form.value.percent
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
      this.loanpercentService.editLoan_percent(
        this.loanPercent.id,
        this.form.value.title,
        this.form.value.percent
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



  onItemSelect(item:any){

  }

  OnItemDeSelect(item:any){

  }


  onClose(): void {
    this.form.reset();
    this.closeModal.emit("none")
  }

}
