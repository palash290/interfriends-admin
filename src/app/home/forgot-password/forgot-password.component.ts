import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  isLoading = false;
  form: FormGroup;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onLogin(): void {
    //debugger
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.forgot_password(this.form.value.email).subscribe((response: any) => {
      if (response.success == '1') {
        this.toastr.success(response.message);
        this.router.navigateByUrl('/');
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.toastr.warning(response.message);
      }
    }, (error: any) => {
      //this.authUserStatusListner.next(false);
      this.isLoading = false;
      this.toastr.error('Something went wrong!');
    });;

    this.form.reset();
    //this.router.navigateByUrl('/');
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
