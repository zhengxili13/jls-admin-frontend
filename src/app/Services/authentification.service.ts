import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AuthentificationService extends appServiceBase {

    private baseUrlToken: string = environment.url + 'api/Token/Auth';

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        protected _httpClient: HttpClient,
        private _translateService: TranslateService,
        protected _matSnackBar: MatSnackBar,
        protected _router: Router
    ) {
        super(_httpClient, _matSnackBar, _router);
    }


    login(criteria): Observable<any> {
        return super.postUrl(this.baseUrlToken, criteria);
    }

    logout() 
    {
        // Set Loginstatus to false and delete saved jwt cookie
        this.loginStatus.next(false);
        localStorage.clear();
        this.router.navigate(['pages']);
   
        return;

    }

    // Method to get new refresh token
    getNewRefreshToken(): Observable<any> {
        let username = localStorage.getItem('username');
        let refreshToken = localStorage.getItem('refreshToken');
        const grantType = "refresh_token";

        return this._httpClient.post<any>(this.baseUrlToken, { username, refreshToken, grantType }).pipe(
            map(result => {
                if (result && result.authToken.token) {
                    this.loginStatus.next(true);
                    localStorage.setItem('loginStatus', '1');
                    localStorage.setItem('jwt', result.authToken.token);
                    localStorage.setItem('username', result.authToken.username);
                    localStorage.setItem('expiration', result.authToken.expiration);
                    localStorage.setItem('userRole', result.authToken.roles);
                    localStorage.setItem('refreshToken', result.authToken.refresh_token);
                }

                return <any>result;

            }, catchError(err=>{
                this.logout();
                return throwError(err);
            }))
        );

    }
    checkLoginStatus(): boolean {

        var loginCookie = localStorage.getItem("loginStatus");

        if (loginCookie == "1") {
            if (localStorage.getItem('jwt') != null || localStorage.getItem('jwt') != undefined) {
                return true;
            }
        }
        return false;
    }
}
