import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';
import { ReferenceService } from 'app/Services/reference.service';

@Component({
  selector: 'app-address-dialog',
  templateUrl: 'address-dialog.component.html',
  styleUrls: ['address-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddressDialog implements OnInit {

  public countryList: any[] = [];
  public adreeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddressDialog>,
    private formBuilder: FormBuilder,
    private referenceService: ReferenceService,
    private translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);

    this.adreeForm = this.formBuilder.group({
      Id: [''],
      EntrepriseName: ['', Validators.required],
      ContactFirstName: ['', Validators.required],
      ContactLastName: ['', Validators.required],
      FirstLineAddress: ['', Validators.required],
      SecondLineAddress: [''],
      City: ['', Validators.required],
      CountryId: [''],
      ZipCode: ['', Validators.required],
      ContactTelephone: ['', Validators.required],
      ContactFax: [''],
      Provence: [''],
      IsDefaultAdress: [''],
      CreatedOn: [''],
      CreatedBy: [''],
      UpdatedOn: [''],
      UpdatedBy: ['']
    });
  }

  ngOnInit() {
    this.adreeForm.setValue(this.data.Address);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  save() {
    this.dialogRef.close({ Address: this.adreeForm.value, Type: this.data.Type });
  }

}
