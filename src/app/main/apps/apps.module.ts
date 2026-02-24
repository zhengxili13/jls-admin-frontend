import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { ErrorsModule } from 'app/main/apps/errors/errors.module';

const routes = [
    {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
    },
    {
        path: 'dashboards/project',
        loadChildren: () => import('./dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    },
    {
        path: 'e-commerce',
        loadChildren: () => import('./e-commerce/e-commerce.module').then(m => m.EcommerceModule)
    },
    {
        path: 'reference',
        loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule)
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
    {
        path: 'errors',
        loadChildren: () => import('./errors/errors.module').then(m => m.ErrorsModule)
    },
    {
        path: '',
        loadChildren: () => import('./dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        ErrorsModule
    ]
})
export class AppsModule {
}
