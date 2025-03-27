import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { ToggleSidebarService  } from 'src/app/service/toggle-sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  name: string;
  image: string;
  notificationCount: number;
  userId: string;
  display : string = 'none';
  display1 : string = 'none';
  menuToggle = true;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    public sidebar : ToggleSidebarService
    ) {}

  ngOnInit(): void {
    this.name = this.authService.getName();
    this.image = 'assets/img/profile.jpg';
    this.userId = this.authService.getUserId();

    this.userService.getNotificationCount().subscribe((response: any) => {
      this.notificationCount = response.count;
    });
  }

  onToggle()
  {
      this.menuToggle = !this.menuToggle;
      this.sidebar.setToggle(this.menuToggle);

  }

  openModal()
  {
    this.display = "block";
  }

  showDropDown(){
    this.display1 = "block";
  }
  onLogout(): void {
    this.authService.logout();
    document.getElementById('logoutModal').click();
    this.toastr.success('You have been logged out successfully');
    this.userService.logout(this.userId).subscribe((response: any) => {

    });
    this.router.navigate(['/']);
  }

  onClose(): void {
    this.display = "none";
  }

  classToggled = false;

  public toggleField() {
    this.classToggled = !this.classToggled;
  }
}


