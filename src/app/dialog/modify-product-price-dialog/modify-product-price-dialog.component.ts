import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';

@Component({
  selector: 'app-modify-product-price-dialog',
  templateUrl: './modify-product-price-dialog.component.html',
  styleUrls: ['./modify-product-price-dialog.component.scss']
})
export class ModifyProductPriceDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModifyProductPriceDialogComponent>,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);
  }

  public product: any = {
    ProductId: 0,
    Quantity: 0,
    Price: 0
  }
  ngOnInit() {
    this.product = this.data.Product;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ Product: this.product });
  }

}
