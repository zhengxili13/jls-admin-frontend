import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ChatService } from 'app/Services/chat.service';
import { Message } from 'app/Services/message';

@Component({
    selector: 'chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls: ['./chat-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewInit {
    user: any;

    userId: number;
    toUserId: number;
    chat: any;
    dialog: any;
    contact: any;
    replyInput: any;
    selectedChat: any[] = [];

    toUserName: string;

    @ViewChild(FusePerfectScrollbarDirective, { static: false })
    directiveScroll: FusePerfectScrollbarDirective;

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm', { static: false })
    replyForm: NgForm;

    // Private
    public _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService,
        private _ngZone: NgZone
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.userId = parseInt(localStorage.getItem('userId'));
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                if (chatData != null && chatData.Chat != null) {
                    this.selectedChat = chatData.Chat.filter(p => p.Body != null && p.FromUserId != null);
                    this.toUserId = chatData.UserId;
                    this.toUserName = chatData.Username;

                    this._chatService.cleanNewMessageByContact(this.toUserId);
                    //this.contact = chatData.contact;
                    //this.dialog = chatData.dialog;
                    this.readyToReply();
                }
            });


        // subscribe to message receiver 
        this._chatService.messageReceived.subscribe((message: Message) => {
            this._ngZone.run(() => {
                message.type = "received";
                if (message.fromUser != this.userId && message.fromUser == this.toUserId) {
                    this.selectedChat.push({
                        Body: message.message,
                        CreatedOn: message.date,
                        FromUserName: 'test'
                    });
                }
            });
        });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean {
        return (
            message.who === this.contact.id &&
            ((this.dialog[i + 1] && this.dialog[i + 1].who !== this.contact.id) || !this.dialog[i + 1])
        );
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean {
        return (i === 0 || this.selectedChat[i - 1] && this.selectedChat[i - 1].FromUserId !== message.FromUserId);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean {
        return (i === this.selectedChat.length - 1 || this.selectedChat[i + 1] && this.selectedChat[i + 1].FromUserId !== message.FromUserId);
    }

    /**
     * Select contact
     */
    selectContact(): void {
        this._chatService.selectContact(this.contact);
    }

    /**
     * Ready to reply
     */
    readyToReply(): void {
        setTimeout(() => {
            this.focusReplyInput();
            this.scrollToBottom();
        });
    }

    /**
     * Focus to the reply input
     */
    focusReplyInput(): void {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void {
        speed = speed || 400;
        if (this.directiveScroll) {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply(event): void {
        event.preventDefault();

        if (!this.replyForm.form.value.message) {
            return;
        }

        // Message
        const message = {
            FromUserId: localStorage.getItem('userId'),
            FromUserName: 'Me',
            Body: this.replyForm.form.value.message,
            CreatedOn: new Date().toISOString()
        };

        // Add the message to the chat
        this.selectedChat.push(message);

        // Reset the reply form
        this.replyForm.reset();

        this._chatService.sendMessage({
            clientuniqueid: parseInt(localStorage.getItem('userId')),
            type: 'sent',
            message: message.Body,
            date: new Date(),
            fromUser: parseInt(localStorage.getItem('userId')),
            toUser: this.toUserId
        });
        // TODO: Update the server
        // this._chatService.updateDialog(this.selectedChat.MessageId, this.dialog).then(response => {
        //     this.readyToReply();
        // });
    }
}
