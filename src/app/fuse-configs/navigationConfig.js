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
                        'id'   : 'basedata-management',
                        'title': 'Basedata Management',
                        'type' : 'item',
                        'icon' : 'question_answer',
                        'url'  : '/settings/basedata',
                        'exact': true
                    },
                    {
                        'id'   : 'get-support',
                        'title': 'Get Support',
                        'type' : 'item',
                        'icon' : 'question_answer',
                        'url'  : '/settings/support',
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
            },
            {
                'id'   : 'events-component',
                'title': 'Event Management',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/events'
            },
        ]
    }
];

export default navigationConfig;
