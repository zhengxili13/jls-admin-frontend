import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthentificationService } from 'app/Services/authentification.service';
import { Observable, BehaviorSubject, pipe, throwError } from 'rxjs';
import {  tap, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})


    export class AppInterceptor implements HttpInterceptor {

    private isTokenRefreshing: boolean = false;

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor (private acct : AuthentificationService) {}

    intercept(request : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>> 
    {
        // Check if the user is logging in for the first time
        if(request.url.indexOf("Export")!=-1){
            return next.handle(request.clone({responseType:  'blob'}));
        }
        return next.handle(this.attachTokenToRequest(request)).pipe(
            tap((event : HttpEvent<any>) => {
                if(event instanceof HttpResponse) 
                {
                    console.log("Success");
                }
            }),
            catchError((err) : Observable<any> => {
                if(err instanceof HttpErrorResponse) {
                    switch((<HttpErrorResponse>err).status) 
                {
                        case 401:
                            console.log("Token expired. Attempting refresh ...");
                            if(request.body!=null&& request.body.GrantType!=null&& request.body.GrantType=='password'){
                               return throwError(err) ;
                            }
                            if(request.body!=null&& request.body.grantType!=null&& request.body.grantType=='refresh_token'){
                                this.acct.logout();
                             }

                            return this.handleHttpResponseError(request, next);
                        
                        case 400:
                            return throwError(err); //<any>this.acct.logout();
                            
                }
                } else 
                {
                    return throwError(this.handleError);
                }
            })

           );

    }


    // Global error handler method 
    private handleError(errorResponse : HttpErrorResponse) 
    {
         return throwError(errorResponse);
    }


    // Method to handle http error response
    private handleHttpResponseError(request : HttpRequest<any>, next : HttpHandler) 
    {

        // First thing to check if the token is in process of refreshing
        if(!this.isTokenRefreshing)  // If the Token Refresheing is not true
        {
            this.isTokenRefreshing = true;

            // Any existing value is set to null
            // Reset here so that the following requests wait until the token comes back from the refresh token API call
            this.tokenSubject.next(null);

            /// call the API to refresh the token
            return this.acct.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if(tokenresponse) 
                    {
                        this.tokenSubject.next(tokenresponse.authToken.token); 
                        localStorage.setItem('loginStatus', '1');
                        localStorage.setItem('jwt', tokenresponse.authToken.token);
                        localStorage.setItem('username', tokenresponse.authToken.username);
                        localStorage.setItem('expiration', tokenresponse.authToken.expiration);
                        localStorage.setItem('userRole', tokenresponse.authToken.roles);
                        localStorage.setItem('refreshToken', tokenresponse.authToken.refresh_token);
                        console.log("Token refreshed...");
                        return next.handle(this.attachTokenToRequest(request));
                }
                    return <any>this.acct.logout();
                }),
                catchError(err => {
                    this.acct.logout();
                    return this.handleError(err);
                }),
                finalize(() => {
                  this.isTokenRefreshing = false;
                })
                );

        }
        else 
        {
            this.isTokenRefreshing = false;
            return this.tokenSubject.pipe(filter(token => token != null),
                take(1),
                switchMap(token => {
                return next.handle(this.attachTokenToRequest(request));
                }), catchError(err=>{
                    this.acct.logout();
                    return this.handleError(err);
                }));
        }
    }


    private attachTokenToRequest(request: HttpRequest<any>) 
    {
        var token = localStorage.getItem('jwt');

        return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    }
}