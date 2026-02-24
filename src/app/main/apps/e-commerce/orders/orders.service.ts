import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {  Observable } from 'rxjs';

import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class EcommerceOrdersService extends appServiceBase 
{
    private apiUrlGetOrdersByCriteria = this.host +"admin/Order/getOrdersByCriteria";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        protected _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router : Router
    )
    {
        super(_httpClient,_matSnackBar,_router);
    }


    getOrdersByCriteria(criteria): Observable<any>
    {
        return  super.getUrl(this.apiUrlGetOrdersByCriteria, criteria );
    }
}
