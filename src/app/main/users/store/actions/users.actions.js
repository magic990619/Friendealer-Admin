import api from 'app/ApiConfig.js'

export const GET_USERS = '[USERS APP] GET USERS';
export const SET_SEARCH_TEXT = '[USERS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_USERS = '[USERS APP] TOGGLE IN SELECTED USERS';
export const SELECT_ALL_USERS = '[USERS APP] SELECT ALL USERS';
export const DESELECT_ALL_USERS = '[USERS APP] DESELECT ALL USERS';
export const OPEN_NEW_USER_DIALOG = '[USERS APP] OPEN NEW USER DIALOG';
export const CLOSE_NEW_USER_DIALOG = '[USERS APP] CLOSE NEW USER DIALOG';
export const OPEN_EDIT_USER_DIALOG = '[USERS APP] OPEN EDIT USER DIALOG';
export const CLOSE_EDIT_USER_DIALOG = '[USERS APP] CLOSE EDIT USER DIALOG';
export const ADD_USER = '[USERS APP] ADD USER';
export const UPDATE_USER = '[USERS APP] UPDATE USER';
export const REMOVE_USER = '[USERS APP] REMOVE USER';
export const REMOVE_USERS = '[USERS APP] REMOVE USERS';
export const RESET_PASSWORD = '[USERS APP] RESET PASSWORD';

export function getUsers(routeParams)
{
    var apiPath = '';
    console.log(routeParams.id);
    switch (routeParams.id) {
    case "active":
        apiPath = '/auth/getActiveAccountData';
        break;
    case "inactive":
        apiPath = '/auth/getInactiveAccountData';
        break;
    case "closed":
        apiPath = '/auth/getClosedAccountData';
        break;
    case "restricted":
        apiPath = '/auth/getRestrictedAccountData';
        break;
    default:
        apiPath = '/auth/getAllAccountData';
    }
    return (dispatch) => api.get(apiPath, {}).then((response) => {
        dispatch({
            type   : GET_USERS,
            payload: response.data.doc,
            routeParams
        });}
    );
}

export function setSearchText(event)
{
    return {
        type      : SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function toggleInSelectedUsers(userId)
{
    return {
        type: TOGGLE_IN_SELECTED_USERS,
        userId
    }
}


export function selectAllUsers()
{
    return {
        type: SELECT_ALL_USERS
    }
}

export function deSelectAllUsers()
{
    return {
        type: DESELECT_ALL_USERS
    }
}


export function openNewUserDialog()
{
    return {
        type: OPEN_NEW_USER_DIALOG
    }
}

export function closeNewUserDialog()
{
    return {
        type: CLOSE_NEW_USER_DIALOG
    }
}

export function openEditUserDialog(data)
{
    return {
        type: OPEN_EDIT_USER_DIALOG,
        data
    }
}

export function closeEditUserDialog()
{
    return {
        type: CLOSE_EDIT_USER_DIALOG
    }
}

export function addUser(newAccount)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().usersApp.users;

        const request = api.post('/auth/addAccountData', {
            newAccount
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: ADD_USER
                })
            ]).then(() => dispatch(getUsers(routeParams)))
        );
    };
}

export function updateUser(user)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().usersApp.users;

        const request = api.post('/auth/updateAccountData', {
            user
        });

        console.log(user);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_USER
                })
            ]).then(() => dispatch(getUsers(routeParams)))
        );
    };
}

export function removeUser(accountId)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().usersApp.users;

        const request = api.post('/auth/removeAccountData', {
            accountId
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_USER
                })
            ]).then(() => dispatch(getUsers(routeParams)))
        );
    };
}

export function removeUsers(accountIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().usersApp.users;

        const request = api.post('/auth/removeAccountsData', {
            accountIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_USERS
                }),
                dispatch({
                    type: DESELECT_ALL_USERS
                })
            ]).then(() => dispatch(getUsers(routeParams)))
        );
    };
}
