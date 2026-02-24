import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { Observable, BehaviorSubject, empty, Subject } from 'rxjs';

import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Message } from './message';
import { UserService } from './user.service';

@Injectable()
export class ChatService extends appServiceBase {

    contacts: any[];
    chats: any[];
    user: any;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;

    public newMessageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public numberOfNewMessageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);


    public noReadMessageSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    private apiUrlMessageHub = this.host + 'MessageHub'
    private apiUrlUpdateReadedDialog = this.host + 'admin/User/UpdateReadedDialog';
    private apiUrlGetNoReadedDialog = this.host + 'admin/User/GetNoReadedDialog';

    messageReceived = new EventEmitter<Message>();
    connectionEstablished = new EventEmitter<Boolean>();
    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor(
        protected _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router: Router,
        private userService: UserService
    ) {
        super(_httpClient, _matSnackBar, _router);
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();


        // Set the defaults
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();


        if (localStorage.getItem('numberOfMessage') != null)
            this.numberOfNewMessageSubject.next(parseInt(localStorage.getItem('numberOfMessage')));


        if (localStorage.getItem('noReadMessage') != null)
            this.noReadMessageSubject.next(JSON.parse(localStorage.getItem('noReadMessage')));
    }
    sendMessage(message: Message) {
        this._hubConnection.invoke('NewMessage', message);
    }

    private createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.apiUrlMessageHub)
            .build();
    }



    UpdateReadedDialog(criteria): Observable<any> {
        return super.getUrl(this.apiUrlUpdateReadedDialog, criteria);
    }

    GetNoReadedDialog
        (criteria): Observable<any> {
        return super.getUrl(this.apiUrlGetNoReadedDialog, criteria);
    }
    /**
   * Get chat
   *
   * @param contactId
   * @returns {Promise<any>}
   */
    getChat(userId, username): Promise<any> {
        // const chatItem = this.user.chatList.find((item) => {
        //     return item.contactId === contactId;
        // });

        // Create new chat, if it's not created yet.
        // if ( !chatItem )
        // {
        //     this.createNewChat(contactId).then((newChats) => {
        //         this.getChat(contactId);
        //     });
        //     return;
        // }

        return new Promise((resolve, reject) => {
            this.userService.GetChatDialog({
                UserId: userId,
                AdminUserId: localStorage.getItem('userId'),
                Username: username
            })
                .subscribe((response: any) => {
                    const chat = response;

                    // const chatContact = this.contacts.find((contact) => {
                    //     return contact.id === contactId;
                    // });

                    // const chatData = {
                    //     chatId : chat.id,
                    //     dialog : chat.dialog,
                    //     contact: chatContact
                    // };
                    this.cleanNewMessageByContact(userId);
                    this.onChatSelected.next({ Chat: chat, UserId: userId, Username: username });

                }, reject);

        });

    }


    /**
     * Select contact
     *
     * @param contact
     */
    selectContact(contact): void {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        this.user.status = status;
    }


    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;

                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                setTimeout(function () { this.startConnection(); }, 50000);
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceived', (data: any) => {
            if (data.fromUser != localStorage.getItem('userId')) {
                /* Build not read object  */

                var noReadObject = [];
                if (this.noReadMessageSubject.value) {
                    noReadObject = this.noReadMessageSubject.value;

                    if (noReadObject.findIndex(p => p.UserId == data.fromUser) == -1) {
                        noReadObject.push({
                            UserId: data.fromUser,
                            NumberOfNoReadMessage: 1
                        });
                    }
                    else {
                        noReadObject.map(p => {
                            if (p.UserId == data.fromUser) {
                                p.NumberOfNoReadMessage = p.NumberOfNoReadMessage + 1;
                            }
                        })
                    }
                }
                else {
                    noReadObject.push({
                        UserId: data.fromUser,
                        NumberOfNoReadMessage: 1
                    });
                }

                localStorage.setItem('noReadMessage', JSON.stringify(noReadObject));
                this.noReadMessageSubject.next(noReadObject);

                localStorage.setItem('numberOfMessage', (this.numberOfNewMessageSubject.value + 1).toString());
                this.numberOfNewMessageSubject.next(this.numberOfNewMessageSubject.value + 1);
                this.newMessageSubject.next(data);
                this.messageReceived.emit(data);
            }

        });
    }

    public cleanNewMessageByContact(userId): void {
        /* Remove no readObject client side */
        var noReadObject = this.noReadMessageSubject.value;
        if (noReadObject != null && noReadObject.length > 0) {
            noReadObject = noReadObject.filter(p => p.UserId != userId);
            this.noReadMessageSubject.next([{ UserId: userId, NumberOfNoReadMessage: 0 }]);

            localStorage.setItem('noReadMessage', JSON.stringify(noReadObject));
        }
        else {
            localStorage.setItem('noReadMessage', JSON.stringify([]));
            this.noReadMessageSubject.next([]);
        }

        /* Remove no readObject server side */
        this.UpdateReadedDialog({
            UserId: userId
        }).subscribe();
    }

    public cleanNewMessage(): void {
        this.numberOfNewMessageSubject.next(0);
        this.newMessageSubject.next(empty);
    }
}
