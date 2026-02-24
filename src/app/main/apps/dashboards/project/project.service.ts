import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { appServiceBase } from 'app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ProjectDashboardService extends appServiceBase implements Resolve<any> {

    projects: any[];
    widgets: any[];
    teamSalesPerformance: any[];
    internalExternalPerformance: any[];
    performanceByStatus: any[];

    salesPerformancePerYearAndMonth: any[];
    recentOrdeInfo: any[];

    private apiUrlGetSalesPerformanceByYearMonth = this.host + "admin/Analytics/GetSalesPerformanceByYearMonth";
    private apiUrlGetInternalExternalSalesPerformance = this.host + "admin/Analytics/GetInternalExternalSalesPerformance";
    private apiUrlGetTeamMemberSalesPerformance = this.host + "admin/Analytics/GetTeamMemberSalesPerformance";

    private apiUrlGetSalesPerformanceByStatus = this.host + "admin/Analytics/GetSalesPerformanceByStatus";
    private apiUrlGetRecentOrderInfo = this.host + "admin/Analytics/GetRecentOrderInfo";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        protected _matSnackBar: MatSnackBar,
        protected _router: Router
    ) {
        super(_httpClient, _matSnackBar, _router);
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProjects(),
                this.getWidgets(),
                this.GetTeamMemberSalesPerformance(),
                this.GetInternalExternalSalesPerformance(),
                this.GetSalesPerformanceByStatus(),
                this.GetSalesPerformanceByYearMonth(),
                this.GetRecentOrderInfo()
            ]).then(
                () => {
                    resolve(null);
                },
                reject
            );
        });
    }

    GetTeamMemberSalesPerformance(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.apiUrlGetTeamMemberSalesPerformance)
                .subscribe((response: any) => {
                    this.teamSalesPerformance = response;
                    resolve(response);
                }, reject);
        });
    }
    GetRecentOrderInfo(): Promise<any> {
        return new Promise((resolve, reject) => {

            super.getUrl(this.apiUrlGetRecentOrderInfo, { Lang: localStorage.getItem('Lang') })
                .subscribe((response: any) => {
                    this.recentOrdeInfo = response;
                    resolve(response);
                }, reject);
        });
    }

    GetSalesPerformanceByYearMonth(): Promise<any> {
        return new Promise((resolve, reject) => {

            super.getUrl(this.apiUrlGetSalesPerformanceByYearMonth, null)
                .subscribe((response: any) => {
                    this.salesPerformancePerYearAndMonth = response;
                    resolve(response);
                }, reject);
        });
    }


    GetInternalExternalSalesPerformance(): Promise<any> {
        return new Promise((resolve, reject) => {

            super.getUrl(this.apiUrlGetInternalExternalSalesPerformance, { Lang: localStorage.getItem('Lang') })
                .subscribe((response: any) => {
                    this.internalExternalPerformance = response;
                    resolve(response);
                }, reject);
        });
    }

    GetSalesPerformanceByStatus(): Promise<any> {
        return new Promise((resolve, reject) => {

            super.getUrl(this.apiUrlGetSalesPerformanceByStatus, { Lang: localStorage.getItem('Lang') })
                .subscribe((response: any) => {
                    this.performanceByStatus = response;
                    resolve(response);
                }, reject);
        });
    }



    /**
     * Get projects
     *
     * @returns {Promise<any>}
     */
    getProjects(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/project-dashboard-projects')
                .subscribe((response: any) => {
                    this.projects = response;
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/project-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }
}
