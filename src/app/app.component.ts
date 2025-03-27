import { Component, OnInit} from '@angular/core';
import { AuthService } from './service/auth.service';
import { MessagingService } from './service/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'myApp';


  constructor(
    private authService: AuthService,
    public messagingService: MessagingService
  ) {}


  ngOnInit(): void {
    this.authService.autoAuthUser();

    // notification code start
    this.messagingService.requestPermissionRoot();
    this.messagingService.receiveMessage();
    // notification code end
  }
}
