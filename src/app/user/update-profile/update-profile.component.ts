import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { User } from '../../model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  userId: string;
  user: User;
  isLoading = true;
  form: FormGroup;
  isLoadingUpdate = false;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      phone: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.userId = this.authService.getUserId();
    this.userService.getUserDetail(this.userId).subscribe((response: any) => {
      this.user = response.userInfo;
      this.isLoading = false;

      this.form.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
      });
    });
  }



  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid ) {
      return;
    }

    this.isLoadingUpdate = true;
    this.authService.saveName(this.form.value.name);
    this.userService.updateProfile(
      this.userId,
      this.form.value.name,
      this.form.value.email,
      this.form.value.phone
    ).subscribe((response: any) => {
      if (response.success === '1') {
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }

      this.isLoadingUpdate = false;
    });
  }

  checkAdminType() {
    if(localStorage.getItem('admin_type_interFriendAdmin') === '2') {
      return true;
    } else {
      return false;
    }
  }

}
