const navigationConfig = [
    {
        'id'      : 'applications',
        'title'   : '',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [
            {
                'id'   : 'dashboard-component',
                'title': 'Dashboard',
                'type' : 'item',
                'icon' : 'dashboard',
                'url'  : '/dashboard',
            },
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
                        'icon' : 'settings_cells',
                        'url'  : '/settings/basedata',
                        'exact': true
                    },
                    {
                        'id'   : 'get-support',
                        'title': 'Get Support',
                        'type' : 'item',
                        'icon' : 'contact_support',
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
                'icon' : 'event_note',
                'url'  : '/events/events',
            },
            {
                'id'   : 'membership-component',
                'title': 'Membership',
                'type' : 'item',
                'icon' : 'card_membership',
                'url'  : '/membership',
            },
            {
                'id'   : 'chat-component',
                'title': 'Chat',
                'type' : 'item',
                'icon' : 'chat',
                'url'  : '/chat',
            },
        ]
    }
];

export default navigationConfig;
