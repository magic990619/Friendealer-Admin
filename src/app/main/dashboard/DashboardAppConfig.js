// import React from 'react';
import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const DashboardAppConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/dashboard',
            component: FuseLoadable({
                loader: () => import('./DashboardPage')
            })
        },
    ]
};
