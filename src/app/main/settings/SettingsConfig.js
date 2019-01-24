import {FuseLoadable} from '@fuse';

export const SettingsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/settings/categories',
            component: FuseLoadable({
                loader: () => import('./categories/Categories')
            })
        },
        {
            path     : '/settings/faq',
            component: FuseLoadable({
                loader: () => import('./faq/Faq')
            })
        }
    ]
};
