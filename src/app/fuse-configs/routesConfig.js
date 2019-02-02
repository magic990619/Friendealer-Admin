import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse/index';
// import {ExampleConfig} from 'app/main/example/ExampleConfig';
import {UsersAppConfig} from 'app/main/users/UsersAppConfig';
import {LoginConfig} from 'app/main/login/LoginConfig';
import {RegisterConfig} from 'app/main/register/RegisterConfig';
import {LogoutConfig} from 'app/main/logout/LogoutConfig';
import {ProfilePageConfig} from 'app/main/profile/ProfilePageConfig'
import {SettingsConfig} from 'app/main/settings/SettingsConfig'
import {EventsConfig} from 'app/main/events/EventsConfig'
import {MembershipConfig} from 'app/main/membership/MembershipConfig'
import {ChatAppConfig} from 'app/main/chat/ChatAppConfig'
import {DashboardAppConfig} from 'app/main/dashboard/DashboardAppConfig'

const routeConfigs = [
    DashboardAppConfig,
    UsersAppConfig,
    LoginConfig,
    RegisterConfig,
    LogoutConfig,
    ProfilePageConfig,
    SettingsConfig,
    EventsConfig,
    MembershipConfig,
    ChatAppConfig
];

 const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path        : '/',
        component   : () => <Redirect to="/dashboard"/>
    }
];

 export default routes;
