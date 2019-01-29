import React from 'react';
import {FuseLoadable} from '@fuse';
import {Redirect} from 'react-router-dom';

export const EventsConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/events/events/:eventId',
            component: FuseLoadable({
                loader: () => import('./event/Event')
            })
        },
        {
            path     : '/events/events',
            component: FuseLoadable({
                loader: () => import('./events/Events')
            })
        },
        {
            path     : '/events',
            component: () => <Redirect to="/events/events"/>
        }
    ]
};
