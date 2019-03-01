import {setInitialSettings} from 'app/store/actions/fuse'; //setDefaultSettings, 
import _ from '@lodash';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

/**
 * Set User Data
 */
export function setUserData(user)
{
    return (dispatch) => {

        /*
        Set User Settings
         */
        //dispatch(setDefaultSettings(user.data.settings));

        /*
        Set User Data
         */
        dispatch({
            type   : SET_USER_DATA,
            payload: user
        })
    }
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings)
{
    return (dispatch, getState) => {
        const oldUser = getState().auth.user;
        const user = _.merge({}, oldUser, {data: {settings}});

        updateUserData(user);

        return dispatch(setUserData(user));
    }
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts)
{
    return (dispatch, getState) => {
        const user = getState().auth.user;
        const newUser = {
            ...user,
            data: {
                ...user.data,
                shortcuts
            }
        };

        updateUserData(newUser);

        return dispatch(setUserData(newUser));
    }
}

/**
 * Remove User Data
 */
export function removeUserData()
{
    return {
        type: REMOVE_USER_DATA
    }
}

/**
 * Logout
 */
export function logoutUser()
{

    return (dispatch, getState) => {
        const user = getState().auth.user;

        jwtService.logout();

        if ( user.role === 'guest' )
        {
            console.log("role is guest");
            return null;
        }

        dispatch(setInitialSettings());

        dispatch({
            type: USER_LOGGED_OUT
        })
    }
}

/**
 * Update User Data
 */
function updateUserData(user)
{
    if ( user.role === 'guest' )
    {
        return;
    }

    jwtService.updateUserData(user)
        .then(() => {
            store.dispatch(Actions.showMessage({message: "User data saved with api"}));
        })
        .catch(error => {
            store.dispatch(Actions.showMessage({message: error.message}));
        });
}
