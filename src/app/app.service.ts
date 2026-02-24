import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { timeout, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environments/environment';

@Injectable()
export abstract class appServiceBase {

    public host: string = environment.url;

    constructor(
        protected httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected router: Router){
    }

    checkNetWork(): boolean{
        if (false){
            this._matSnackBar.open('Please Check your netWork', 'Ok', {
                verticalPosition: 'top',
                duration        : 2000
            });
            return false;
        }
        return true;
    }
   // todo change
    checkResult(todo): boolean{
        return true;
    }

    public postUrl(url: string, body: any): Observable<any>{
        return this.httpClient.post(url, body)
            .pipe(catchError(this.handleError));
    }

    public postFileUrl(url: string, body: any, options : any): Observable<any>{
        return this.httpClient.post(url, body, options)
            .pipe(catchError(this.handleError));
    }

    public getUrl(url: string, criteria: any): Observable<any>{
        const params = new HttpParams({ fromObject: criteria });
        return this.httpClient.get(url, {params: params})
            .pipe(catchError(this.handleError));
    }
 

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);

            // tslint:disable-next-line: align
            if (error.status == 500){
                this.router.navigateByUrl('/apps/errors/error-500');
            }
            else if (error.status == 404){
                this.router.navigateByUrl('/apps/errors/error-500');
            }
            else if (error.status == 401 || error.status == 403 ){
                localStorage.clear();
                if(this.router!=null){
                    this.router.navigate(['login']);
                }
            }
        }
        // return an observable with a user-facing error message
        return throwError(
          {
              Status: error.status,
              Body : error.error
          });
      }
}
