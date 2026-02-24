import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Inject } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as chinese } from './i18n/cn';
import { locale as french } from './i18n/fr';
import { environment } from '../../../../../environments/environment';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/Services/user.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AddressDialog } from './../../../../dialog/address-dialog/address-dialog.component';
import { distinctUntilChanged, debounceTime, switchMap, map, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  displayedColumns = ['username', 'entrepriseName', 'userType', 'telephone', 'active'];
  //imageRoot = this._ecommerceProductsService.host + "images/";


  public environment = environment;
  public view: string = "users";
  public userRoleList: any[] = [];
  public totalCount: number = 0;
  public userList: any[] = [];
  public pageEvent: any;

  public searchCriteria = {
    UserType: null,
    Validity: true,
    Username: '',
    begin: 0,
    step: 10,
    Lang: ''
  };

  public statusList: any[] = [{
    Value: true,
    Label: 'Valide'
  }, {
    Value: false,
    Label: 'Invalide'
  }];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;


  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private userService: UserService,
    public dialog: MatDialog,
    private _fuseProgressBarService: FuseProgressBarService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, chinese, french);
  }

  ngOnInit() {

    // load user role list 
    this.userService.getUserRoleList().subscribe(result => {
      if (result != null && result.length > 0) {
        this.userRoleList = result;
      }
    },
      error => {
        // todo 
      });
  }

  getSecondCategoryList() {

  }

  search() {
    this._fuseProgressBarService.show();
    this.userService.advancedUserSearch(this.searchCriteria).subscribe(result => {
      // Only the super admin can view the account of super admin
      if (result != null) {
        if (localStorage.getItem('userRole') != null && localStorage.getItem('userRole') == 'SuperAdmin') {
          this.userList = result.UserList;
          this.totalCount = result.TotalCount;

        }
        else {
          // admin can only modify himself and client
          this.userList = result.UserList.filter(p => p.UserRoleName == 'Client' || p.Id == localStorage.getItem('userId'));
          this.totalCount = result.TotalCount;
        }
      }
      this._fuseProgressBarService.hide();
    },
      error => {
        this._fuseProgressBarService.hide();
      });
  }

  getServerData(event) {
    this.searchCriteria.begin = event.pageIndex;
    this.searchCriteria.step = event.pageSize;
    this.search();
  }

  sortData(event) {

  }

  insertOrUpdateUser(userId) {


    var filterUserRoleList = this.userRoleList.filter(p => p.Name != 'SuperAdmin');
    const dialogRef = this.dialog.open(UserDialog, {
      width: '600px',
      data: { userRoleList: filterUserRoleList, statusList: this.statusList, userId: userId }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null && result.IsSaved != null && result.IsSaved == true) {
        this.search();
      }
    });

  }
}


@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.html',
})
export class UserDialog {
  public userForm: FormGroup;
  public modifyPassword: boolean = false;
  private password: string;
  private confirmPassword: string;
  public modifyPasswordDisabled: boolean = false;

  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _matSnackBar: MatSnackBar,
    private _fuseProgressBarService: FuseProgressBarService,
    private _translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.formBuilder.group({
      Email: ['', Validators.compose([Validators.required, Validators.email]), this.userNameUniqueValidator()],
      RoleId: ['', Validators.required],
      Validity: ['']
    });
  }


  userNameUniqueValidator() {
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
        switchMap(() => this.userService.CheckUserIsAlreadyExistAsync({ Username: control.value })),
        //对返回值进行处理，null表示正确，对象表示错误
        map(res => res == true ? { duplicate: true } : null),
        //每次验证的结果是唯一的，截断流
        first()
      );
    }
  }

  isAlreadyExists(): boolean {
    return this.userForm.get('Email').hasError('duplicate');
  }

  ngOnInit() {

    if (this.data.userId != 0) {
      this.userService.GetUserById({ UserId: this.data.userId }).subscribe(result => {

        if (result != null) {
          this.userForm.controls['Email'].setValue(result.Email);
          this.userForm.controls['Email'].disable();
          this.userForm.controls['RoleId'].setValue(result.RoleId);
          this.userForm.controls['Validity'].setValue(result.Validity);
        }
      });
    }
    else {
      this.modifyPassword = true;
      this.modifyPasswordDisabled = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ IsSaved: false });
  }

  checkSaveButton() {
    if (this.userForm.status == "VALID" && (this.modifyPassword == false || (this.modifyPassword == true && !this.checkPasswordLength() && !this.checkPasswordSame()))) {
      return false;
    }
    else {
      return true;
    }
  }

  checkPasswordLength() {
    return this.password == null || this.password.length < 8;
  }


  checkPasswordSame() {
    return this.password == null || this.confirmPassword == null || !(this.confirmPassword === this.password);
  }

  save() {
    var criteria = this.userForm.getRawValue();
    criteria.UserId = this.data.userId;
    this._fuseProgressBarService.show();
    criteria.Password = this.password == null ? '' : this.password;
    this.loading = true;
    this.userService.CreateOrUpdateUser(criteria).subscribe(result => {
      if (result.Succeeded != null && result.Succeeded == false) {
        result.Errors.forEach(p => {
          if (p.Code == "DuplicateUserName" || p.Code == "DuplicateUserName") {
            this._matSnackBar.open(this._translateService.instant('users.Error_UserAlreadyExists'), 'OK', {
              duration: 2000
            });
          }
        });
      }
      else if (result > 0) {
        this._matSnackBar.open(this._translateService.instant('users.ActionSuccess'), 'OK', {
          duration: 2000
        });

        this.dialogRef.close({ IsSaved: true });
      }
      this._fuseProgressBarService.hide();
      this.loading = false
    },
      error => {

        this._matSnackBar.open(this._translateService.instant('users.ActionFail'), 'OK', {
          duration: 2000
        });

        this.loading = false;
        //todo
      });
  }

  addAddress() {
    const dialogRef = this.dialog.open(AddressDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 'yes') {
        this.dialogRef.close({});
      }
    });
  }

}
