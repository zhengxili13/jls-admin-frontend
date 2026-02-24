import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboards',
                title    : 'Dashboards',
                translate: 'NAV.DASHBOARDS',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
               
                    {
                        id   : 'project',
                        title: 'Project',
                        type : 'item',
                        url  : '/apps/dashboards/project'
                    }
                ]
            },
            {
                id       : 'chat',
                title    : 'Chat',
                translate: 'NAV.INBOX',
                type     : 'item',
                icon     : 'chat',
                url      : '/apps/chat',
            },
            {
                id : 'products-management',
                title : 'Products Management',
                translate : 'NAV.PRODUCTS_MANAGEMENT',
                type : 'collapsable',
                icon     : 'shopping_cart',
                children : [
                    {
                        id        : 'products',
                        title     : 'Products',
                        translate: 'NAV.PRODUCTS',
                        type      : 'item',
                        url       : '/apps/e-commerce/products',
                        exactMatch: true
                    },
                    {
                        id        : 'cart',
                        title     : 'Cart',
                        translate: 'NAV.CART',
                        type      : 'item',
                        url       : '/apps/e-commerce/cart',
                        exactMatch: true
                    }
                ]
            },{
                id : 'orders-management',
                title : 'Orders Management',
                translate : 'NAV.ORDERS_MANAGEMENT',
                type : 'collapsable',
                icon    : 'receipt',
                children: [
                    {
                        id        : 'orders',
                        title     : 'Orders',
                        translate: 'NAV.ORDERS',
                        type      : 'item',
                        url       : '/apps/e-commerce/orders',
                        exactMatch: true
                    }
                ]
            },{
                id : 'reference-management',
                title : 'Reference Management',
                translate : 'NAV.REFERENCE_MANAGEMENT',
                type : 'collapsable',
                icon : 'build',
                children: [
                    {
                        id        : 'reference-items',
                        title     : 'Reference Items',
                        translate: 'NAV.REFERENCE_ITEMS',
                        type      : 'item',
                        url       : '/apps/reference/items',
                        exactMatch: true
                    },
                    {
                        id        : 'reference-category',
                        title     : 'Reference Category',
                        translate: 'NAV.REFERENCE_CATEGORY',
                        type      : 'item',
                        url       : '/apps/reference/category',
                        exactMatch: true
                    }
                ]
            },
            {
                id : 'user-management',
                title : 'User management',
                translate : 'NAV.USER_MANAGEMENT',
                type : 'collapsable',
                icon : 'supervised_user_circle',
                children: [
                    {
                        id        : 'User-list',
                        title     : 'User list',
                        translate: 'NAV.USER',
                        type      : 'item',
                        url       : '/apps/user/users',
                        exactMatch: true
                    }
                ]
            },
            // {
            //     id       : 'sample',
            //     title    : 'Sample',
            //     translate: 'NAV.SAMPLE.TITLE',
            //     type     : 'item',
            //     icon     : 'email',
            //     url      : '/sample',
            //     badge    : {
            //         title    : '25',
            //         translate: 'NAV.SAMPLE.BADGE',
            //         bg       : '#F44336',
            //         fg       : '#FFFFFF'
            //     }
            // }      
        ]
    }
];
