import { MatToolbarModule } from '@angular/material/toolbar';
import { ConfimDialog } from './../../../dialog/confim-dialog/confim-dialog.component';
import { DialogModule } from './../../../dialog/dialog.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

import { GoogleMapsModule } from '@angular/google-maps';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { EcommerceProductsComponent } from 'app/main/apps/e-commerce/products/products.component';

import { EcommerceProductComponent, ImageOverViewDialog, ProductEvaluationDialog } from 'app/main/apps/e-commerce/product/product.component';

import { EcommerceOrdersComponent } from 'app/main/apps/e-commerce/orders/orders.component';
import { EcommerceOrdersService } from 'app/main/apps/e-commerce/orders/orders.service';
import { EcommerceOrderComponent } from 'app/main/apps/e-commerce/order/order.component';


import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CartComponent } from './cart/cart.component';

import { NgxLoadingModule } from 'ngx-loading';
import { DatePipe } from '@angular/common';

const routes: Routes = [
    {
        path: 'products',
        component: EcommerceProductsComponent
    },
    {
        path: 'product',
        component: EcommerceProductComponent
    },
    {
        path: 'orders',
        component: EcommerceOrdersComponent
    },
    {
        path: 'order',
        component: EcommerceOrderComponent
    },
    {
        path: 'cart',
        component: CartComponent
    }
];

@NgModule({
    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent,
        EcommerceOrdersComponent,
        EcommerceOrderComponent,
        ImageOverViewDialog,
        ProductEvaluationDialog,
        CartComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        NgxLoadingModule.forRoot({}),
        MatGridListModule,
        DialogModule,
        MatDatepickerModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatRadioModule,
        MatToolbarModule,
        NgxMatSelectSearchModule,

        TranslateModule,
        NgxChartsModule,
        GoogleMapsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        EcommerceOrdersService,
        DatePipe
    ]
})
export class EcommerceModule {
}
