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
                        'id'   : 'admin-settings',
                        'title': 'Admin Settings',
                        'type' : 'item',
                        'icon' : 'settings_applications',
                        'url'  : '/profile/10',
                        'exact': true
                    },
                    {
                        'id'   : 'categories',
                        'title': 'Event Categories',
                        'type' : 'item',
                        'icon' : 'category',
                        'url'  : '/settings/categories',
                        'exact': true
                    },
                    {
                        'id'   : 'faq',
                        'title': 'FAQ',
                        'type' : 'item',
                        'icon' : 'question_answer',
                        'url'  : '/settings/faq',
                        'exact': true
                    },
                ]
            }
        ]
    }
];

export default navigationConfig;
