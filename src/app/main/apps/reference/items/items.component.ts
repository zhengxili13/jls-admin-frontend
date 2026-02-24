
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, first } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ConfimDialog } from './../../../../dialog/confim-dialog/confim-dialog.component';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';

import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReferenceService } from 'app/Services/reference.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { ItemDialog } from './item-dialog.component';

@Component({
    selector: 'reference-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReferenceItemsComponent implements OnInit {
    displayedColumns = ['id', 'code', 'parent', 'label', 'category', 'value', 'active'];
    dialogRef: any;
    pageEvent: any;

    loading: boolean = false;

    public referenceItemList: any[] = [];
    public totalCount: number = 0;
    public categoryList: any[] = [];
    public parentReferenceItemList: any[] = [];


    public statusList: any[] = [{
        Value: true,
        Label: 'Valide'
    }, {
        Value: false,
        Label: 'Invalide'
    }
    ];


    public searchCriteria: any = {
        step: 10,
        begin: 0,
        Lang: this._translateService.currentLang,
        ParentId: null,
        Validity: null,
        ReferenceCategoryId: null,
        SearchText: '',
        IgnoreProduct: true,
        ParentCategoryId: 0
    }

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private referenceService: ReferenceService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _translateService: TranslateService,
        public dialog: MatDialog,
        private _fuseProgressBarService: FuseProgressBarService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);
    }

    ngOnInit(): void {
        this.getCategoryList();
        this.getParentReferenceItemList();

    }

    getServerData(event) {
        this.searchCriteria.begin = event.pageIndex;
        this.searchCriteria.step = event.pageSize;
        this.search();
    }

    search() {
        this._fuseProgressBarService.show();
        this.referenceService.advancedSearchReferenceItem(this.searchCriteria).subscribe(result => {
            if (result != null && result.ReferenceItemList != null && result.TotalCount != null) {
                this.totalCount = result.TotalCount;
                this.referenceItemList = result.ReferenceItemList;
            }
            this._fuseProgressBarService.hide();
        },
            error => {
                this._fuseProgressBarService.hide();
            });
    }

    getCategoryList() {
        var criteria = {
            step: 0,
            begin: 0
        }
        this.referenceService.getAllCategoryList(criteria).subscribe(result => {
            if (result != null && result.ReferenceCategoryList != null) {
                this.categoryList = result.ReferenceCategoryList.filter(p => p.ShortLabel != "Product");
            }
        },
            error => {

            });
    }

    getParentReferenceItemList() {
        var criteria = {
            Lang: this._translateService.currentLang
        }

        this.referenceService.getAllReferenceItemWithChildren(criteria).subscribe(result => {
            this.parentReferenceItemList = result;
        },
            error => {

            });
    }


    getTargetReferenceItemByCategory() {
        return this.parentReferenceItemList.filter(p => p.CategoryId == this.searchCriteria.ParentCategoryId);
    }

    updateOrCreateReferenceItem(item) {

        const dialogRef = this.dialog.open(ItemDialog, {
            width: '600px',
            data: { referenceItem: item, referenceCategoryList: this.categoryList, statusList: this.statusList, parentReferenceItemList: this.parentReferenceItemList }
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result != null && result.IsSaved != null && result.IsSaved == true) {
                this.search();
                this.getParentReferenceItemList();
            }
        });

    }

    getEmptyReferenceItem() {
        return {
            Id: 0,
            Label: null,
            Validity: true,
            CategoryId: 0,
            Category: {},
            Labels: [],
            ParentId: null,
            ParentCategoryId: null,
            ParentReferenceItem: null
        }
    }
}


