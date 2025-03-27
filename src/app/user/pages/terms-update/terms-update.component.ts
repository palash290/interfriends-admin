import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-terms-update',
  templateUrl: './terms-update.component.html',
  styleUrls: ['./terms-update.component.css']
})
export class TermsUpdateComponent implements OnInit {

  userId: string;
  isLoading = true;
  info: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.userService.getTermsInfo().subscribe((response: any) => {
      this.info = response.termsInfo;
      this.isLoading = false;
    });
  }


  onSave(): any {
    if(this.info) {
    } else {
      this.toastr.error('Please enter info');
      return;
    }

    this.userService.addTerms(
      this.info
      ).subscribe((response: any) => {
        this.isLoading = false;
        if (response.success === '1') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
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
