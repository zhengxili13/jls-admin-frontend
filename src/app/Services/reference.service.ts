import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ReferenceService extends appServiceBase 
{

    private apiUrlGetReferenceItemsByCategoryLabels: string = this.host + "admin/Reference/GetReferenceItemsByCategoryLabels";
    private apiUrlGetAllCategoryList: string = this.host + "admin/Reference/GetAllCategoryList";
    private apiUrlAdvancedSearchReferenceItem: string = this.host + "admin/Reference/AdvancedSearchReferenceItem";
    private apiUrlGetAllReferenceItemWithChildren: string = this.host + "admin/Reference/GetAllReferenceItemWithChildren";
    private apiUrlCheckReferenceCodeExists: string = this.host + "admin/Reference/CheckReferenceCodeExists";
    

    private apiUrlSaveReferenceItem: string = this.host + "admin/Reference/SaveReferenceItem";
    
    constructor(
        protected _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router : Router
    )
    {
        super(_httpClient,_matSnackBar,_router);
    }

    /* todo change to ri service */
    getReferenceItemsByCategoryLabels(criteria : any): Observable<any>
    {
        return super.postUrl(this.apiUrlGetReferenceItemsByCategoryLabels,criteria);
    } 

    getAllCategoryList(criteria : any): Observable<any>
    {
        return super.getUrl(this.apiUrlGetAllCategoryList,criteria);
    } 

    advancedSearchReferenceItem(criteria : any): Observable<any>
    {
        return super.postUrl(this.apiUrlAdvancedSearchReferenceItem,criteria);
    } 

    getAllReferenceItemWithChildren(criteria : any): Observable<any>
    {
        return super.getUrl(this.apiUrlGetAllReferenceItemWithChildren,criteria);
    } 

    saveReferenceItem(criteria: any): Observable<any>{
        return super.postUrl(this.apiUrlSaveReferenceItem,criteria);
    }

    checkReferenceCodeExists(criteria : any): Observable<any>
    {
        return super.getUrl(this.apiUrlCheckReferenceCodeExists,criteria);
    } 
    
}
