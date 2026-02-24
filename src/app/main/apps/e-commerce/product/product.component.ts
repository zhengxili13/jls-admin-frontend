import { state } from '@angular/animations';
import { ConfimDialog } from './../../../../dialog/confim-dialog/confim-dialog.component';
import { Action } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, merge } from 'rxjs';
import { takeUntil, filter, map, distinctUntilChanged, debounceTime, switchMap, first } from 'rxjs/operators';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';

//import { MatFileUploadModule } from 'angular-material-fileupload';
import { Product } from 'app/main/apps/e-commerce/product/product.model';

import { ActivatedRoute, Params, Router } from "@angular/router";
import { Validators } from '@angular/forms';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { HttpEventType } from '@angular/common/http';
import { ProductService } from 'app/Services/product.service';
import { ReferenceService } from 'app/Services/reference.service';

import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'e-commerce-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EcommerceProductComponent implements OnInit {

    product: Product;
    pageType: string;
    productForm: FormGroup;
    categoryTable: Array<any>;
    mainCategory: string = "";
    imageDatas: Array<File> = [];
    langLabels: Array<{ "lang": string, "label": string }>;
    taxRateTable: Array<any> = [];
    loading: boolean = false;


    public saveLoading: boolean = false

    public previousView: string = "";
    public view: string = "product";
    public productId: number = 0;
    public mainCategoryList: any[] = [];
    public secondCategoryList: any[] = [];
    public referenceItemList: any[] = [];
    public taxRateList: any[] = [];
    public productInfo: any = {};
    public photoPath: any = [];

    public uploadLoading: boolean = false;

    public validityList: any[] = [{
        Value: true,
        Label: 'Valide'
    }, {
        Value: false,
        Label: 'Invalide'
    }
    ];
    public productName: string = "";
    public imgURL: any;
    public progress: any;

    public ProductEvaluationList: any[] = [];

    constructor(
        private referenceService: ReferenceService,
        private productService: ProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private _fuseProgressBarService: FuseProgressBarService,
        private router: Router
    ) {
        // Set the default
        this.product = new Product();

        this.productForm = this.formBuilder.group({
            Labelfr: ['', Validators.required],
            Labelcn: [''],
            Labelen: [''],
            ReferenceCode: ['', Validators.required, this.codeUniqueValidator()],
            Description: [''],
            MainCategoryId: ['', Validators.required],
            SecondCategoryId: ['', Validators.required],
            ProductId: ['0'],
            ReferenceId: ['0'],
            QuantityPerBox: [''],
            MinQuantity: ['', Validators.required],
            Price: ['', Validators.required],
            TaxRateId: ['', Validators.required],
            Size: [''],
            Color: [''],
            Material: [''],
            Validity: ['']
        });

        this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);

    }

    codeUniqueValidator() {
        return (control: FormControl): any => {
            //进入管道进行串行操作
            //valueChanges表示字段值变更才触发操作
            return control.valueChanges.pipe(
                //同valueChanges，不写也可
                distinctUntilChanged(),
                //防抖时间，单位毫秒
                debounceTime(1000),
                //调用服务，参数可写可不写，如果写的话变成如下形式
                //switchMap((val) => this.registerService.isUserNameExist(val))
                switchMap(() => this.referenceService.checkReferenceCodeExists({ Code: control.value })),
                //对返回值进行处理，null表示正确，对象表示错误
                map(res => (res == true && (this.productId == 0 || this.productInfo.ReferenceCode != control.value)) ? { duplicate: true } : null),
                //每次验证的结果是唯一的，截断流
                first()
            );
        }
    }

    isAlreadyExists(): boolean {
        return this.productForm.get('ReferenceCode').hasError('duplicate');
    }


    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe((params: Params) => {
            this.productId = params['Id'];
            this.previousView = params['View'];

            if (this.productId != null && this.productId != 0) {
                // todo new product 
                this.getProdudctData();
            }
            else {
                // new product 
                this.productName = "New product"; // todo translate
            }
        });
        this.initLoadData();
    }

    getProdudctData() {

        this.productService.GetProductById(this.productId).subscribe(result => {

            this.productInfo = result;
            if (result != null) {
                this.productName = this.getDefaultProductName();
                // todo change
                if (result.ImagesPath != null && result.ImagesPath.length > 0) {

                    var photoList = [];
                    result.ImagesPath.map(p => {
                        photoList.push({ CompletePath: environment.url + p.Path, ProductPhotoId: p.Id });
                    });
                    this.photoPath = photoList;
                }
                else {
                    this.photoPath = [];
                }

                if (result.Translation != null && result.Translation.length > 0) {
                    result.Translation.map(val => {
                        result['Label' + val.Lang] = val.Label;
                    });
                }
                // delete result.Translation;
                // delete result.ImagesPath;
                // delete result.TaxRate;
                // delete result.Label;
                // delete result.Comments;
                this.productForm.patchValue(result);
            }


        },
            error => {

            });
        this.productService.GetProductCommentListByCriteria(
            {
                ProductId: this.productId,
                Lang: this._translateService.currentLang,
                Step: -1,
                Begin: -1
            }).subscribe(result => {
                if (result.Success) {
                    this.ProductEvaluationList = result.Data.ProductCommentListData;
                }
            },
                error => {

                });

    }


    getDefaultProductName() {
        if (this.productInfo != null && this.productInfo.Translation != null && this.productInfo.Translation.length > 0) {
            var productLabelObject = this.productInfo.Translation.find(p => p.Lang == this._translateService.currentLang);
            if (productLabelObject == null) {
                productLabelObject = this.productInfo.Translation[0];
            }
            return productLabelObject.Label;
        }
        return "";
    }

    initLoadData(): void {
        var criteria = {
            Lang: this._translateService.getDefaultLang(),
            ShortLabels: ['MainCategory', 'SecondCategory', 'TaxRate']
        };
        this.referenceService.getReferenceItemsByCategoryLabels(criteria).subscribe(result => {
            if (result != null && result.length > 0) {
                this.referenceItemList = result;
                this.mainCategoryList = result.filter(p => p.ReferenceCategoryLabel == "MainCategory");
                this.taxRateList = result.filter(p => p.ReferenceCategoryLabel == "TaxRate");

            }
        },
            error => {

            });
    }


    uploadImage(file) {


        if (file.length == 0) {
            return;
        }
        let fileToUpload = <File>file[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        formData.append('ProductId', this.productId.toString());

        this.saveLoading = true;
        this._fuseProgressBarService.show();

        this.productService.UploadPhoto(formData, { reportProgress: true, observe: 'events' })
            .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round(100 * event.loaded / event.total);

                }
                else if (event.type === HttpEventType.Response) {
                    this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_UploadSuccess'), 'OK', {
                        duration: 2000
                    });
                    this.getImagePath();

                }
                this.saveLoading = false;
            },
                error => {

                    this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_UploadFail'), 'OK', {
                        duration: 2000
                    });
                    this.saveLoading = false;
                });

    }

    openImageViewDialog(image) {

        const dialogRef = this.dialog.open(ImageOverViewDialog, {

            data: { image: image }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.action != null && result.action == "remove") {
                this.getProdudctData();
            }
        });
    }

    getImagePath() {
        this.productService.GetProductPhotoPathById({ ProductId: this.productId }).subscribe(result => {
            if (result != null && result.length > 0) {
                result.map(p => {
                    p.CompletePath = environment.url + p.Path;
                    p.ProductPhotoId = p.Id
                });
                this.photoPath = result;
                this._fuseProgressBarService.hide();

            }
        },
            error => {
                // todo change 
            });
    }


    getSecondCategoryList() {

        var categoryId = this.productForm.controls['MainCategoryId'].value;
        if (categoryId != null && categoryId != 0) {
            return this.referenceItemList.filter(p => p.ParentId == categoryId);
        }
        return [];
    }

    saveProduct() {
        this._fuseProgressBarService.show();
        var criteria = this.productForm.value;
        criteria.CreatedOrUpdatedBy = localStorage.getItem('userId');
        this.saveLoading = true;
        this.productService.UpdateOrCreateProduct(criteria).subscribe(result => {
            if (result > 0) {

                this._matSnackBar.open(this._translateService.instant('PRODUCT.ActionSuccess'), 'OK', {
                    duration: 2000
                });
                this.router.navigate(['apps/e-commerce/products']); // todo

            }
            else {
                // error 

                this._matSnackBar.open(this._translateService.instant('PRODUCT.ActionFail'), 'OK', {
                    duration: 2000
                });
            }
            this.saveLoading = false;
            this._fuseProgressBarService.hide();
        },
            error => {
                this._matSnackBar.open(this._translateService.instant('PRODUCT.ActionFail'), 'OK', {
                    duration: 2000
                });

                this.saveLoading = false;
            });
    }

    ModifyProductEvaluation(ProductEvaluation) {


        const dialogRef = this.dialog.open(ProductEvaluationDialog, {

            data: { ProductEvaluation: ProductEvaluation }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.action != null && result.action == "remove" && result.CommentId != null && result.CommentId > 0) {

                this.ProductEvaluationList = this.ProductEvaluationList.filter(p => p.ProductComment.Id != result.CommentId);
            }
        });
    };


}

@Component({
    selector: 'image-over-view-dialog',
    templateUrl: 'image-over-view-dialog.html'
})

export class ImageOverViewDialog {
    imageRoot = environment.url + "images/";
    image: any;
    imagePath: string;

    public removeImageLoading: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ImageOverViewDialog>,
        private productService: ProductService,
        private _matSnackBar: MatSnackBar,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.image = this.data.image;
    }


    remove(): void {
        const dialogRef = this.dialog.open(ConfimDialog, {
            data: {
                title: this._translateService.instant('PRODUCT.Msg_RemoveTitle'),
                message: this._translateService.instant('PRODUCT.Msg_RemoveMessage')
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.action != null && result.action == 'yes' && this.image.ProductPhotoId != null) {
                this.removeImageLoading = true;
                this.productService.RemoveImageById(this.image.ProductPhotoId).subscribe(result => {
                    if (result > 0) {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemovePhotoSuccess'), 'OK', { // todo translate
                            duration: 2000
                        });
                    }
                    else {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemovePhotoFail'), 'OK', { // todo translate
                            duration: 2000
                        });
                    }
                    //
                    this.dialogRef.close({ action: 'remove', image: this.image.ProductPhotoId });
                    this.removeImageLoading = false;
                },
                    error => {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemovePhotoFail'), 'OK', { // todo translate
                            duration: 2000
                        });
                        this.removeImageLoading = false;
                    });

            }
        });

    }

    close(): void {
        this.dialogRef.close({ action: 'None' });
    }

}



@Component({
    selector: 'product-evaluation-dialog',
    templateUrl: 'product-evaluation-dialog.html'
})

export class ProductEvaluationDialog {

    public removeEvaluationLoading: boolean = false;
    public ProductComment: any = {};

    constructor(
        public dialogRef: MatDialogRef<ProductEvaluationDialog>,
        private productService: ProductService,
        private _matSnackBar: MatSnackBar,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.ProductComment = this.data.ProductEvaluation.ProductComment;
    }


    remove(): void {
        const dialogRef = this.dialog.open(ConfimDialog, {
            data: {
                title: this._translateService.instant('PRODUCT.Msg_RemoveTitle'),
                message: this._translateService.instant('PRODUCT.Msg_RemoveMessage')
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.action != null && result.action == 'yes' && this.ProductComment.Id != null) {
                this.removeEvaluationLoading = true;
                this.productService.RemoveProductCommentById({ CommentId: this.ProductComment.Id }).subscribe(result => {
                    if (result > 0) {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemoveProductCommentSuccess'), 'OK', { // todo translate
                            duration: 2000
                        });
                    }
                    else {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemoveProductCommentFail'), 'OK', { // todo translate
                            duration: 2000
                        });
                    }
                    //
                    this.dialogRef.close({ action: 'remove', CommentId: result });
                    this.removeEvaluationLoading = false;
                },
                    error => {
                        this._matSnackBar.open(this._translateService.instant('PRODUCT.Msg_RemoveProductCommentFail'), 'OK', { // todo translate
                            duration: 2000
                        });
                        this.removeEvaluationLoading = false;
                    });

            }
        });

    }

    close(): void {
        this.dialogRef.close({ action: 'None' });
    }

}
