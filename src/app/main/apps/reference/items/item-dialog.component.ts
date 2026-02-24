
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReferenceService } from 'app/Services/reference.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Component({
    selector: 'item-dialog',
    templateUrl: './item-dialog.html',
    styleUrls: ['./items.component.scss'],
})
export class ItemDialog implements OnInit {
    @ViewChild('contactForm', { static: false }) contactForm: NgForm;

    public Loading: boolean = false;
    public CodeExist: boolean = false;

    public itemInfo = {
        Id: 0,
        Code: '',
        CategoryId: 0,
        Validity: true,
        Value: '',
        ParentCategoryId: 0,
        ParentId: 0,
        LabelFR: null,
        LabelEN: null,
        LabelCN: null,
        CreatedOrUpdatedBy: null
    };


    constructor(
        public dialogRef: MatDialogRef<ItemDialog>,
        public dialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _fuseProgressBarService: FuseProgressBarService,
        private referenceService: ReferenceService,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {

        this.itemInfo = this.data.referenceItem;
        this.getFormatedTranslation();
        this.getParentCateogryId();
    }

    onNoClick(): void {
        this.dialogRef.close({ IsSaved: false });
    }

    isAlreadyExists() {
        if (this.itemInfo.Code != null) {
            this.referenceService.checkReferenceCodeExists({ Code: this.itemInfo.Code }).subscribe(result => {
                if (result == true) {
                    this.CodeExist = true;
                }
                else {
                    this.CodeExist = false;
                }
            },
                error => {
                    this.CodeExist = false;
                })
        }
    }


    onSubmit(form) {

        this._fuseProgressBarService.show();
        this.Loading = true;
        //saveReferenceItem
        this.itemInfo.CreatedOrUpdatedBy = localStorage.getItem('userId');
        this.referenceService.saveReferenceItem(this.itemInfo).subscribe(result => {
            if (result > 0) {

                this._matSnackBar.open(this._translateService.instant('users.ActionSuccess'), 'OK', {
                    duration: 2000
                });

                this.dialogRef.close({ IsSaved: true });
            }
            this.Loading = false;
            this._fuseProgressBarService.hide();
        },
            error => {
                this._matSnackBar.open(this._translateService.instant('users.ActionFail'), 'Fail', {
                    duration: 2000
                });

                this.Loading = false;
                this._fuseProgressBarService.hide();
            })
    }

    getParentCateogryId() {
        if (this.data.referenceItem != null && this.data.referenceItem.ParentReferenceItem != null
            && this.data.referenceItem.ParentReferenceItem.CategoryId != null) {
            this.itemInfo.ParentCategoryId = this.data.referenceItem.ParentReferenceItem.CategoryId;
        }
    }

    getTargetReferenceItemByCategory() {
        return this.data.parentReferenceItemList.filter(p => p.CategoryId == this.itemInfo.ParentCategoryId);
    }

    getFormatedTranslation() {
        if (this.data.referenceItem != null && this.data.referenceItem.Labels != null) {
            this.data.referenceItem.Labels.forEach(p => {
                this.itemInfo['Label' + p.Lang.toUpperCase()] = p.Label;
            });
        }
    }

}
