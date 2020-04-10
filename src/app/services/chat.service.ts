import { Injectable } from '@angular/core';
import  "firebase/database";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';


import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
        /*this.afAuth.authState.subscribe(auth => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
          }

          this.getUser().subscribe(a => {
            this.userName = a.displayName;
          });
        });*/
    }

  /*getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getUsers() {
    const path = '/users';
    return this.db.list(path);
  }*/

  public sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    //const email = this.user.email;
    const email= 'test@example.com';
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      //userName: this.userName,
      userName: 'test-user',
      email: email });
      console.log('called sendMessage()');
  }

  getMessages(): AngularFireList<ChatMessage> {
    //console.log("yup");
    // query to create our message feed binding
    return this.db.list('/messages',ref=> {
     let q= ref.limitToLast(20).orderByKey();
     return q;
    });
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }
}