import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  userId: string;
  form: FormGroup;
  isLoading = false;
  checkPassword: boolean;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      oldpassword: new FormControl(null, {validators: [Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]}),
      confirmPassword: new FormControl(null, {validators: [Validators.required]})
    });
    this.userId = this.authService.getUserId();
  }

  checkPasswords(): boolean {
    let pass = this.form.get('password').value;
    let confirmPass = this.form.get('confirmPassword').value;

    if (pass === confirmPass) {
      this.checkPassword = false;
    } else {
      this.checkPassword = true;
    }
    return this.checkPassword;
  }


  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.checkPassword) {
      return;
    }

    this.isLoading = true;

    this.userService.resetPassword(
      this.form.value.oldpassword,
      this.form.value.password,
      this.userId)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (response.success === '1') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
    });

    this.form.reset();
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

}
