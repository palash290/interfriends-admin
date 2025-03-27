import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { environment } from '../../environments/environment';


const WEB_URL = environment.apiUrl;

@Injectable({ providedIn: 'root'})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private toastr: ToastrService,
    public userService: UserService,
    private router: Router,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId: any, token: any) {
     // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = [];
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId: string) {
    console.log('dsfsdhfsdfsdfsdf');
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token,'tokentokentokentokentokentoken');
        // update token
        this.userService.updateWebToken(userId , token)
        .subscribe((userData: any) => {
        });
      },
      (err) => {
       console.log(err, 'errorrrrrr exit')
      }
    );
  }


  requestPermissionRoot() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token,'tokentokentokentokentokentoken');
      },
      (err) => {
       console.log(err, 'errorrrrrr exit')
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    console.log('receiveMessage');
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);

        this.currentMessage.next(payload);
        this.showCustomNotification(payload);
        this.currentMessage.next(null);
      })
  }


  showCustomNotification(payload: any) {
    console.log(payload, "payload")
    let notify_data=payload['notification'];
    let title=notify_data.title;
    let options={
      body:notify_data.body,
      icon:'assets/img/logo/logo.png',
      badge:'assets/img/logo/logo.png'
    }
    console.log("new message received. ", title);
    console.log("new message received. ", options);

    let notify:Notification= new Notification(title,options)

    // notify.onclick = event =>{
    //   event.preventDefault();
    //   window.location.href = WEB_URL;
    // }
  }
}
