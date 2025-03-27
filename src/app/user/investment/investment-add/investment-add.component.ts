import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService} from '../../../service/auth.service';
import { InvestmentService} from '../../../service/investment.service';
import { Investment } from 'src/app/model/investment.model';
import { UserService } from 'src/app/service/user.service';
import { AllUser } from 'src/app/model/allUser.model';

@Component({
  selector: 'app-investment-add',
  templateUrl: './investment-add.component.html',
  styleUrls: ['./investment-add.component.css']
})
export class InvestmentAddComponent implements OnInit {

  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  mainId: string;
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Input() userId: string;
  @Input() groupId: string;
  @Input() add: string;
  @Output() valueChange = new EventEmitter();
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();
  investment: Investment;
  isLoadingProperty = true;
  propertyList: AllUser[] = [];


  constructor(
    public authService: AuthService,
    public investmentService: InvestmentService,
    public userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = 'create';
    this.form = new FormGroup({
      property_id: new FormControl(null, { validators: [Validators.required] }),
      amount	: new FormControl(null, { validators: [Validators.required] }),
      description	: new FormControl(null, { validators: [Validators.required] }),
      payment_method: new FormControl(null, { validators: [Validators.required] }),
      note_title: new FormControl(null, { validators: [Validators.required] }),
      note_description: new FormControl(null, { validators: [Validators.required] }),
    });


    this.userService.allPropertyList().subscribe((response: any) => {
        this.propertyList= response.propertyList;
        this.isLoadingProperty = false;
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
          this.investmentService.investment_detail(this.mainId)
          .subscribe((response: any) => {
            this.investment =  response.investmentDetail;
            this.form.patchValue({
              property_id: this.investment.property_id,
              amount: this.investment.amount,
              description: this.investment.description,
              payment_method: this.investment.payment_method,
              note_title: this.investment.note_title,
              note_description: this.investment.note_description
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

      this.investmentService.addInvestment(
        this.userId,
        this.groupId,
        this.form.value.property_id,
        this.form.value.amount,
        this.form.value.description,
        '2',
        this.form.value.payment_method,
        this.form.value.note_title,
        this.form.value.note_description
      ).subscribe((response: any) => {
        this.form.reset();
        document.getElementById('closePopup').click();
        this.isLoading = false;


        if (response.success === '1') {
          this.valueChange.emit('add');
          this.router.navigate(['/user/UserGroupAddList',response.group_id]);
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
      this.investmentService.editInvestment(
        this.investment.id,
        this.userId,
        this.groupId,
        this.form.value.property_id,
        this.form.value.amount,
        this.form.value.description,
        '2',
        this.form.value.payment_method,
        this.form.value.note_title,
        this.form.value.note_description
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
