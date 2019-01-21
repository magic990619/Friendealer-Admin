import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse/index';
// import {ExampleConfig} from 'app/main/example/ExampleConfig';
import {ContactsAppConfig} from 'app/main/contacts/ContactsAppConfig';
import {LoginConfig} from 'app/main/login/LoginConfig';
import {RegisterConfig} from 'app/main/register/RegisterConfig';
import {LogoutConfig} from 'app/main/logout/LogoutConfig';

const routeConfigs = [
    // ExampleConfig,
    ContactsAppConfig,
    LoginConfig,
    RegisterConfig,
    LogoutConfig,
];

 const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        component: () => <Redirect to="/"/>
    }
];

 export default routes;
