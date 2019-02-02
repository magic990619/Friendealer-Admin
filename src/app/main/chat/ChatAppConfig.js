import {FuseLoadable} from '@fuse';

export const ChatAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/chat',
            component: FuseLoadable({
                loader: () => import('./ChatApp')
            })
        }
    ]
};
