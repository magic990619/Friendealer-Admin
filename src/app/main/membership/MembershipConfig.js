import React from 'react';
import {FuseLoadable} from '@fuse';
import {Redirect} from 'react-router-dom';

export const MembershipConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/membership',
            component: FuseLoadable({
                loader: () => import('./MembershipPage')
            })
        },
    ]
};
