

import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';

import { takeUntil } from 'rxjs/operators';

import { FormGroup } from '@angular/forms';
import { ReferenceService } from 'app/Services/reference.service';

@Component({
    selector: 'reference-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReferenceCategoryComponent implements OnInit {

    public totalCount: number = 0;
    public referenceCategroyList: any[] = [];
    public step = 10;
    public begin = 0;
    public modifyOrAddCategoryPermission = false;

    displayedColumns = ['id', 'shortLabel'];

    dialogRef: any;
    loading: boolean = false;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private referenceService: ReferenceService,
        private dialog: MatDialog,
    ) {
        // Set the private defaults
        this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        var criteria = {
            step: this.step,
            begin: this.begin
        }
        this.referenceService.getAllCategoryList(criteria).subscribe(result => {
            if (result != null && result.ReferenceCategoryList != null && result.TotalCount != null) {
                this.totalCount = result.TotalCount;
                this.referenceCategroyList = result.ReferenceCategoryList;
            }
        },
            error => {

            });
    }

    getServerData(event) {
        this.begin = event.pageIndex;
        this.step = event.pageSize;
        this.search();
    }

    ShowCategoryDialog(categoryDetail: any) {

    }

    crateNewCategory() {
        return {
            Id: 0,
            shortLabel: ''
        }
    }
}
