import { NgModule } from '@angular/core';
import { ConfimDialog } from './confim-dialog/confim-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddressDialog } from './address-dialog/address-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerInfoDialogComponent } from './customer-info-dialog/customer-info-dialog.component';
import { ShipmentInfoDialogComponent } from './shipment-info-dialog/shipment-info-dialog.component';
import { ModifyProductPriceDialogComponent } from './modify-product-price-dialog/modify-product-price-dialog.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    declarations: [
        ConfimDialog,
        AddressDialog,
        CustomerInfoDialogComponent,
        ShipmentInfoDialogComponent,
        ModifyProductPriceDialogComponent
    ],
    imports: [
        MatDatepickerModule,
        MatDialogModule,
        MatButtonModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [ConfimDialog, AddressDialog, CustomerInfoDialogComponent, ShipmentInfoDialogComponent, ModifyProductPriceDialogComponent],
})

export class DialogModule { }