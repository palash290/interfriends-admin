import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { ToggleSidebarService } from 'src/app/service/toggle-sidebar.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  name: string;
  image: string;
  adminType: string;

  toggleOnOff : boolean = true;
  serviceManagementOpen = false;

  constructor(
    public authService: AuthService,
    public toggleServ : ToggleSidebarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.adminType = this.authService.getAdminType();
    this.name = this.authService.getName();
    this.image = 'assets/img/profile.jpg';
    this.syncServiceManagementState(this.router.url);

    this.toggleServ.toggleChange.subscribe((data : boolean)=>{
      this.toggleOnOff = data;
      console.log("Event Triggered=>", this.toggleOnOff)
    })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.syncServiceManagementState(event.urlAfterRedirects);
      }
    });

  }

  toggleServiceManagement(event: Event): void {
    event.preventDefault();
    this.serviceManagementOpen = !this.serviceManagementOpen;
  }

  private syncServiceManagementState(url: string): void {
    this.serviceManagementOpen =
      url.includes('/user/services') ||
      url.includes('/user/categoryList');
  }

  ngOnDestroy() {
    this.toggleServ.toggleChange.unsubscribe();

  }

}
