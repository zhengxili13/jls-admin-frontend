import { Component, OnInit, Inject } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shipment-info-dialog',
  templateUrl: './shipment-info-dialog.component.html',
  styleUrls: ['./shipment-info-dialog.component.scss']
})
export class ShipmentInfoDialogComponent implements OnInit {


  public shipmentForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ShipmentInfoDialogComponent>,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);

    this.shipmentForm = this.formBuilder.group({
      Id: [''],
      ShipmentNumber: [''],
      Weight: [''],
      Fee: [''],
      Date: [''],
      CreatedOn: [''],
      CreatedBy: [''],
      UpdatedOn: [''],
      UpdatedBy: ['']
    });
  }

  ngOnInit() {
    this.shipmentForm.setValue(this.data.ShipmentInfo);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ ShipmentInfo: this.shipmentForm.value });
  }

}
