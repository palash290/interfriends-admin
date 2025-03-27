import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { UserList } from 'src/app/model/userList.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnChanges {
  @Input() uniqueId: string;
  @Input() eachChange: string;
  @Output()  closeModal: EventEmitter < string > = new EventEmitter < string > ();

  userId: string;
  user: UserList;
  isLoading = true;

  constructor(
    public userService: UserService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
  }



  ngOnChanges(changes: { [property: string]: SimpleChange }): void {
    if (changes['uniqueId'] !== undefined || changes['eachChange'] !== undefined) {
      if (changes['eachChange'].currentValue !== undefined) {
          if (changes['uniqueId'] === undefined) {
            this.userId = this.userId;
          } else if (changes['uniqueId'].currentValue !== undefined) {
            this.userId = changes['uniqueId'].currentValue;
          } else {
            this.userId = this.userId;
          }

          this.isLoading = true;
          this.userService.getUserInfo(this.userId).subscribe((response: any) => {
            this.user = response.userinfo
            this.isLoading = false;
          });
      }
    }
  }

  onClose(): void {

    this.closeModal.emit("none");
  }

}
