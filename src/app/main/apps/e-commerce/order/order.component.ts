import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReferenceService } from 'app/Services/reference.service';
import { OrderService } from 'app/Services/order.service';

import { environment } from '../../../../../environments/environment';

import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddressDialog } from 'app/dialog/address-dialog/address-dialog.component';


import { ShipmentInfoDialogComponent } from 'app/dialog/shipment-info-dialog/shipment-info-dialog.component';

import { CustomerInfoDialogComponent } from 'app/dialog/customer-info-dialog/customer-info-dialog.component';

import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { ModifyProductPriceDialogComponent } from 'app/dialog/modify-product-price-dialog/modify-product-price-dialog.component';

@Component({
    selector: 'e-commerce-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EcommerceOrderComponent implements OnInit {

    public displayTransactionModule: boolean = true;
    public displayShippingModule: boolean = true;

    public environment = environment;
    public order: any = {};
    public orderId: number = 0;
    public statusList: any[] = [];
    public taxRateList: any[] = [];

    public countryList: any[] = [];

    public criteria: any = {
        taxRateId: 0,
        statusId: 0,
        ClientRemark: { Id: 0, Text: null },
        AdminRemark: { Id: 0, Text: null }
    }

    public view: string = "order";

    public basicTotalPrice: number;

    public orderType: string = 'OrderType_Internal'; // OrderType_Internal / OrderType_External

    public urlReturnView: string = '';
    public title: string = '';
    public Loading: boolean = false;

    // todo: place into the configuration file
    public orderStatusClass: any[] = [
        { Code: 'OrderStatus_Valid', Class: 'green-500' },
        { Code: 'OrderStatus_Refus', Class: 'red-500' },
        { Code: 'OrderStatus_Progressing', Class: 'orange-500' },
    ]

    constructor(
        private _formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute,
        private referenceService: ReferenceService,
        private orderService: OrderService,
        private translationService: TranslateService,
        private dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _matSnackBar: MatSnackBar,
        private router: Router
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);
    }


    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe((params: Params) => {
            var previousPage = params['View'];

            if (previousPage != null && previousPage == 'orders') {
                this.urlReturnView = '/apps/e-commerce/orders';
                // Orders page come into
                this.orderId = params['Id'] != null && params['Id'] != 0 ? params['Id'] : 0;

                if (this.orderId != 0) {
                    this.initLoadData();
                }
                else {
                    if (localStorage.getItem('cart') != null) {
                        this.order.ProductList = JSON.parse(localStorage.getItem('cart'));
                    }
                }
            }
            else {
                this.urlReturnView = '/apps/e-commerce/cart';
                this.title = this.translationService.instant('order.NewOrder'); // todo translation

                if (this.orderId == 0 && localStorage.getItem('cart') != null) {
                    this.order.ProductList = JSON.parse(localStorage.getItem('cart'));
                }
            }

            // get status label
            this.referenceService.getReferenceItemsByCategoryLabels({
                Lang: this.translationService.currentLang,
                ShortLabels: ['OrderStatus', 'TaxRate']
            }).subscribe(result => {
                if (result != null) {

                    this.statusList = result.filter(p => p.ReferenceCategoryLabel == 'OrderStatus' && p.Validity == true);
                    this.taxRateList = result.filter(p => p.ReferenceCategoryLabel == 'TaxRate' && p.Validity == true);
                    if (this.orderId == 0) {
                        this.statusList = this.statusList.filter(p => p.Code == 'OrderStatus_Progressing');
                        if (this.statusList != null && this.statusList.length > 0) {
                            this.criteria.statusId = this.statusList[0].Id;
                        }
                        if (this.taxRateList != null && this.taxRateList.length > 0) {
                            this.criteria.taxRateId = this.taxRateList[0].Id;
                        }
                    }
                }
            },
                error => {
                    //todo 
                });

        });
    }

    private UpdateProductPriceQuantity(product) {

        const dialogRef = this.dialog.open(ModifyProductPriceDialogComponent, { // todo change
            data: {
                Product: product
            }
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result != null) {
                product = result.Product;
            }
        });

    }

    public getCurrentTaxRatePercentage() {
        var taxRate = this.taxRateList.find(p => p.Id == this.criteria.taxRateId);
        if (taxRate != null && taxRate.Value != null) {
            return taxRate.Value;
        }
        return 0;
    }

    ModifyCustomerInfo() {
        const dialogRef = this.dialog.open(CustomerInfoDialogComponent, { // todo change
            data: {
                CustomerInfo: this.order.CustomerInfo
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this.order.CustomerInfo = result.CustomerInfo;
            }
        });

    }

    calculBasicTotalPrice() {
        var TotalPrice = 0;
        if (this.basicTotalPrice == null && this.order.ProductList != null) {
            this.order.ProductList.forEach(p => {
                if (p.Quantity != null && p.Price != null) {
                    TotalPrice = TotalPrice + p.Quantity * p.Price;
                }
            });
        }
        else {
            TotalPrice = this.basicTotalPrice;
        }

        return TotalPrice;
    }


    saveOrder() {
        var Order = this.order.OrderInfo != null ? this.order.OrderInfo : {};
        Order.TaxRateId = this.criteria.taxRateId;
        Order.StatusReferenceItemId = this.criteria.statusId;


        var OrderCriteria = {
            AdminRemark: this.criteria.AdminRemark.Text == null ? null : this.criteria.AdminRemark,
            ClientRemark: this.criteria.ClientRemark.Text == null ? null : this.criteria.ClientRemark,
            ShipmentInfo: this.order.ShipmentInfo,
            ShippingAddress: this.order.ShippingAdress,
            FacturationAddress: this.order.FacturationAdress,
            Orderinfo: Order,
            CreatedOrUpdatedBy: localStorage.getItem('userId'),
            References: this.order.ProductList,
            CustomerInfo: this.order.CustomerInfo
        }

        this._fuseProgressBarService.show();
        this.Loading = true;
        this.orderService.saveAdminOrder(OrderCriteria).subscribe(result => {
            if (result > 0) {

                this._fuseProgressBarService.hide();

                this._matSnackBar.open(this.translationService.instant('order.ActionSuccess'), 'OK', {
                    duration: 2000
                });

                this.orderId = result;
                if (this.order.Id == null || this.order.Id == 0) {
                    localStorage.removeItem('cart'); // remove cart after the order is created
                }



                //this.initLoadData();
                this.router.navigate(['apps/e-commerce/orders']); // todo
            }
            else {
                this._matSnackBar.open(this.translationService.instant('order.ActionFail'), 'OK', {
                    duration: 2000
                });
            }
            this.Loading = true;
        },
            error => {
                this.Loading = true;
                this._matSnackBar.open(this.translationService.instant('order.ActionFail'), 'OK', {
                    duration: 2000
                });
            });
    }

    matchStatusClass(Code) {
        if (this.orderStatusClass != null && Code != null) {
            var temp = this.orderStatusClass.find(p => p.Code == Code);
            if (temp != null) {
                return temp.Class;
            }
        }
        return '';
    }


    checkSaveButtonAvailable() {
        if (this.criteria.statusId != null && this.criteria.statusId != 0 && this.order.ShippingAdress != null && this.order.FacturationAdress != null) {
            return false;
        }
        return true;
    }

    initLoadData(): void {
        var criteria = {
            OrderId: this.orderId,
            Lang: this.translationService.currentLang
        }
        this.Loading = true;
        this.orderService.getOrdersListByOrderId(criteria).subscribe(result => {
            if (result != null && result.Data != null) {
                this.order = result.Data;

                this.orderId = result.Data.OrderInfo.Id;
                this.criteria.statusId = result.Data.Status.Id;

                if (result.Data.ClientRemark != null) {
                    this.criteria.ClientRemark = result.Data.ClientRemark;
                }
                if (result.Data.AdminRemark != null) {
                    this.criteria.AdminRemark = result.Data.AdminRemark;
                }

                if (result.Data.OrderType != null) {
                    this.orderType = result.Data.OrderType.Code;
                }

                if (result.Data.OrderInfo != null && result.Data.OrderInfo.TaxRateId != null) {
                    this.criteria.taxRateId = result.Data.OrderInfo.TaxRateId;
                }



                this.title = this.translationService.instant('order.OrderNumber') + ' ' + this.orderId; // todo translation

            }
            this.Loading = false;
        },
            error => {
                this.Loading = false;
                //todo
            });


        this.referenceService.getReferenceItemsByCategoryLabels({
            Lang: this.translationService.currentLang,
            ShortLabels: ['Country']
        }).subscribe(result => {
            if (result != null) {

                this.countryList = result.filter(p => p.Validity == true);
            }
        },
            error => {
                //todo 
            });

    }




    modifyAddress(addressType) {

        var addressData = null;
        if (addressType == 'InvoiceAddress') {
            if (this.order.FacturationAdress == null) {
                addressData = this.getEmptyAddressInfo();
            }
            else {
                addressData = this.order.FacturationAdress;
            }
        }
        else if (addressType == 'ShippingAddress') {
            if (this.order.ShippingAdress == null) {
                addressData = this.getEmptyAddressInfo();
            }
            else {
                addressData = this.order.ShippingAdress;
            }
        }
        const dialogRef = this.dialog.open(AddressDialog, {
            data: {
                Type: addressType,
                Address: addressData
            } // todo translate
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result != null) {
                if (result.Type != null) {
                    if (result.Type == 'ShippingAddress') {
                        this.order.ShippingAdress = result.Address;
                    }
                    else if (result.Type = 'InvoiceAddress') {
                        this.order.FacturationAdress = result.Address;
                    }
                }
            }
        });
    }

    getEmptyAddressInfo() {
        return {
            Id: 0,
            ContactFax: null,
            ContactLastName: null,
            ContactFirstName: null,
            ZipCode: null,
            FirstLineAddress: null,
            SecondLineAddress: null,
            City: null,
            CountryId: null,
            EntrepriseName: null,
            ContactTelephone: null,
            Provence: null,
            IsDefaultAdress: null,
            CreatedOn: null,
            CreatedBy: null,
            UpdatedOn: null,
            UpdatedBy: null
        }
    }

    getEmptyShipmentInfo() {
        return {
            Id: 0,
            ShipmentNumber: null,
            Weight: null,
            Fee: null,
            Date: null,
            CreatedOn: null,
            CreatedBy: null,
            UpdatedOn: null,
            UpdatedBy: null
        }
    }


    ModifyShipmentInfo() {

        var ShipmentInfo = null
        if (this.order == null || this.order.ShipmentInfo == null) {
            ShipmentInfo = this.getEmptyShipmentInfo();
        }
        else {
            ShipmentInfo = this.order.ShipmentInfo;
        }
        const dialogRef = this.dialog.open(ShipmentInfoDialogComponent, {
            data: {
                ShipmentInfo: ShipmentInfo
            } // todo translate
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result != null) {
                this.order.ShipmentInfo = result.ShipmentInfo;
            }

        });
    }


}
