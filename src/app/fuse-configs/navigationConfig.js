const navigationConfig = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [
            {
                'id'   : 'contacts-component',
                'title': 'User Management',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/users'
            }
        ]
    }
];

export default navigationConfig;
