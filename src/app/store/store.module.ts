import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from 'environments/environment';
import { reducers, effects, CustomSerializer } from 'app/store';
import { RouterStateSerializer } from '@ngrx/router-store';

export const metaReducers: MetaReducer<any>[] = [];

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: !environment.production,
                strictActionImmutability: !environment.production,
            }
        }),
        EffectsModule.forRoot(effects),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule.forRoot()
    ],
    providers: [
        {
            provide: RouterStateSerializer,
            useClass: CustomSerializer
        }
    ]
})

export class AppStoreModule {
}
