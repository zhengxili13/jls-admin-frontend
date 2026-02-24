import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'confim-dialog',
    templateUrl : 'confim-dialog.component.html'
})

export class ConfimDialog {

    constructor(
      public dialogRef: MatDialogRef<ConfimDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {

      }

      ngOnInit(): void{
        
      }
      

    choseYes(): void {
      this.dialogRef.close({action : 'yes'});
    }

    choseNo(): void{
        this.dialogRef.close({action : 'no'});
    }
  
  }