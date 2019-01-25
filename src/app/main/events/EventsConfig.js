import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseLoadable} from '@fuse';

export const EventsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/events/:id',
            component: FuseLoadable({
                loader: () => import('./Events')
            })
        },
        {
            path     : '/events',
            component: () => <Redirect to="/events/all"/>
        }
    ]
};
