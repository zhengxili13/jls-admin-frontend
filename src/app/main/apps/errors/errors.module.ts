import { NgModule } from '@angular/core';

import { Error500Module } from 'app/main/apps/errors/500/error-500.module';
import { Error404Module } from 'app/main/apps/errors/404/error-404.module';


@NgModule({
    imports     : [
        Error500Module,
        Error404Module
    ]
})
export class ErrorsModule
{
}
