import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.required] })
    });
  }

  onLogin(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.authService.getauthUserStatusListner()
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.authService.login(this.form.value.email, this.form.value.password);

    // this.form.reset();
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
