const navigationConfig = [
    {
        'id'      : 'applications',
        'title'   : '',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [
            {
                'id'   : 'users-component',
                'title': 'User Management',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/users'
            },
            {
                'id'   : 'settings-component',
                'title': 'Settings',
                'type' : 'collapse',
                'icon' : 'settings',
                'url'  : '/settings',
                'children': [
                    {
                        'id'   : 'categories',
                        'title': 'Event Categories',
                        'type' : 'item',
                        'icon' : 'category',
                        'url'  : '/settings/categories',
                        'exact': true
                    },
                ]
            }
        ]
    }
];

export default navigationConfig;
