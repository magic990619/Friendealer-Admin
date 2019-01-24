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
        }
    ]
};
