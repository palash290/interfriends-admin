import { Component, OnInit } from '@angular/core';
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

  constructor(
    public authService: AuthService,
    public toggleServ : ToggleSidebarService
  ) { }

  ngOnInit(): void {
    this.adminType = this.authService.getAdminType();
    this.name = this.authService.getName();
    this.image = 'assets/img/profile.jpg';

    this.toggleServ.toggleChange.subscribe((data : boolean)=>{
      this.toggleOnOff = data;
      console.log("Event Triggered=>", this.toggleOnOff)
  })

  }

  ngOnDestroy() {
    this.toggleServ.toggleChange.unsubscribe();

  }

}
