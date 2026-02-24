import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ExportService extends appServiceBase 
{
 
    private apiUrlExportAction: string = this.host + "api/Export/ExportAction";


    constructor(
        protected _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router : Router,
        public http: HttpClient
    )
    {
        super(_httpClient,_matSnackBar,_router);
    }


    ExportAction(criteria : any) : Observable<any>
    {  

        return  this.http.post(this.apiUrlExportAction,criteria);
    } 



    
}
