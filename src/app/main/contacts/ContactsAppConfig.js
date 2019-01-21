import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseLoadable} from '@fuse';

export const ContactsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/users/:id',
            component: FuseLoadable({
                loader: () => import('./ContactsApp')
            })
        },
        {
            path     : '/users',
            component: () => <Redirect to="/users/all"/>
        }
    ]
};
