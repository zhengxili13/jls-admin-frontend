import { DialogModule } from './dialog/dialog.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AppStoreModule } from 'app/store/store.module';
import { AuthGuard } from './auth.guard';

import { ProductService } from 'app/Services/product.service';
import { ReferenceService } from 'app/Services/reference.service';
import { OrderService } from 'app/Services/order.service';
import { UserService } from 'app/Services/user.service';
import { AuthentificationService } from 'app/Services/authentification.service';

import { AppInterceptor } from './app.interceptor';
import { ExportService } from './Services/export.service';
import { ChatService } from './Services/chat.service';

const appRoutes: Routes = [

    {
        path: 'apps',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: '',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: '**',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        DialogModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        MatSnackBarModule,
        // App modules
        LayoutModule,
        SampleModule,
        AppStoreModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        AuthentificationService,

        { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },

        ProductService,
        ReferenceService,
        OrderService,
        UserService,
        ExportService,
        ChatService
    ]
})
export class AppModule {
}
