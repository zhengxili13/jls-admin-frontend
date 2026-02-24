import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {  Observable } from 'rxjs';

import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class UserService extends appServiceBase 
{
    private apiUrlGetUserListByRole = this.host +"admin/User/GetUserListByRole";
    private apiUrlAdvancedUserSearch = this.host +"admin/User/AdvancedUserSearch";
    private apiUrlGetUserRoleList = this.host +"admin/User/GetUserRoleList";
    private apiUrlGetUserById = this.host + "admin/User/GetUserById";
    private apiUrlCreateOrUpdateUser = this.host + "admin/User/CreateOrUpdateUser";

    private apiUrlCheckUserIsAlreadyExistAsync = this.host + "api/User/CheckUserIsAlreadyExistAsync";
    
    private apiUrlGetChatedUser = this.host +"admin/User/GetChatedUser";
    private apiUrlGetChatDialog = this.host +"admin/User/GetChatDialog";
    
    constructor(
        protected _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router : Router
    )
    {
        super(_httpClient,_matSnackBar,_router);
    }


    getUserListByRole(criteria): Observable<any>
    {
        return  super.postUrl(this.apiUrlGetUserListByRole, criteria );
    }

    advancedUserSearch(criteria) : Observable<any>
    {
        return  super.postUrl(this.apiUrlAdvancedUserSearch, criteria );
    }

    GetChatedUser(criteria) : Observable<any>
    {
        return  super.getUrl(this.apiUrlGetChatedUser ,criteria);
    }

    GetChatDialog(criteria) : Observable<any>
    {
        return  super.getUrl(this.apiUrlGetChatDialog ,criteria);
    }

    getUserRoleList() : Observable<any>
    {
        return  super.getUrl(this.apiUrlGetUserRoleList ,null);
    }

    GetUserById(criteria) : Observable<any>
    {
        return  super.getUrl(this.apiUrlGetUserById, criteria );
    }
    
    CreateOrUpdateUser(criteria) : Observable<any>
    {
        return  super.postUrl(this.apiUrlCreateOrUpdateUser, criteria);
    }

    CheckUserIsAlreadyExistAsync(criteria):  Observable<boolean>
    {
        return  super.getUrl(this.apiUrlCheckUserIsAlreadyExistAsync, criteria);
    }
}
