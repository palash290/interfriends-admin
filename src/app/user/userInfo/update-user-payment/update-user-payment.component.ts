import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { UserListService } from 'src/app/service/userList.service';

@Component({
  selector: 'app-update-user-payment',
  templateUrl: './update-user-payment.component.html',
  styleUrls: ['./update-user-payment.component.css']
})
export class UpdateUserPaymentComponent implements OnInit {
  isLoading = false;
  isLoadingUpdate = false;
  form: FormGroup;
  mode = 'create';
  ID: string;
  private readonly positiveAmountPattern = /^(?=.*[1-9])(?:\d+|\d*\.\d+)$/;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public userListService: UserListService,
    private toastr: ToastrService,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ID = paramMap.get('id');
    });
    this.form = new FormGroup({
      savings: new FormControl(null, { validators: [Validators.pattern(this.positiveAmountPattern)] }),
      jnr_amount: new FormControl(null, { validators: [Validators.pattern(this.positiveAmountPattern)] }),
      expected_date: new FormControl(null, { validators: [Validators.required] }),
      christmas_date: new FormControl(null, { validators: [Validators.required] }),
    });
  };

  allowPositiveAmount(event: KeyboardEvent): void {
    if (event.key.length !== 1) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const nextValue = `${input.value.slice(0, input.selectionStart || 0)}${event.key}${input.value.slice(input.selectionEnd || 0)}`;

    if (!/^\d*\.?\d*$/.test(nextValue)) {
      event.preventDefault();
    }
  }

  sanitizePositiveAmount(controlName: string): void {
    const control = this.form.get(controlName);

    if (!control) {
      return;
    }

    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return;
    }

    const sanitizedValue = String(value)
      .replace(/[^\d.]/g, '')
      .replace(/(\..*)\./g, '$1');

    if (sanitizedValue !== value) {
      control.setValue(sanitizedValue);
    }
  }


  onSave(): void {
    this.form.markAllAsTouched();
    console.log(this.form.invalid);


    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const userData = new FormData();
    if (this.form.value.savings != '') {
      userData.append('amount', this.form.value.savings);
    }
    if (this.form.value.jnr_amount != '') {
      userData.append('jnr_amount', this.form.value.jnr_amount);

    }
    userData.append('expected_date', this.form.value.expected_date);
    userData.append('christmas_date', this.form.value.christmas_date);

    userData.append('id', this.ID);
    
    this.userListService.postAPI('/editUserGroupJnr', userData).subscribe((response: any) => {
      this.form.reset();


      this.isLoading = false;
      console.log("out", this.isLoading)

      if (response.success === '1') {

        this.toastr.success(response.message);

      } else {
        this.toastr.error(response.message);
      }
      window.location.href = 'https://interfriends.uk/app/#/';
    });

  }



}
