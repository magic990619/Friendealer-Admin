import axios from 'axios';
import api from 'app/ApiConfig.js'
import {getUserData} from 'app/main/contacts/store/actions/user.actions';

export const GET_CONTACTS = '[CONTACTS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[CONTACTS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_CONTACTS = '[CONTACTS APP] TOGGLE IN SELECTED CONTACTS';
export const SELECT_ALL_CONTACTS = '[CONTACTS APP] SELECT ALL CONTACTS';
export const DESELECT_ALL_CONTACTS = '[CONTACTS APP] DESELECT ALL CONTACTS';
export const OPEN_NEW_CONTACT_DIALOG = '[CONTACTS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[CONTACTS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[CONTACTS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[CONTACTS APP] CLOSE EDIT CONTACT DIALOG';
export const ADD_CONTACT = '[CONTACTS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[CONTACTS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[CONTACTS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[CONTACTS APP] REMOVE CONTACTS';
export const TOGGLE_STARRED_CONTACT = '[CONTACTS APP] TOGGLE STARRED CONTACT';
export const TOGGLE_STARRED_CONTACTS = '[CONTACTS APP] TOGGLE STARRED CONTACTS';
export const SET_CONTACTS_STARRED = '[CONTACTS APP] SET CONTACTS STARRED ';

export function getContacts(routeParams)
{
    var apiPath = '';
    switch (routeParams.id) {
    case "all":
        apiPath = '/auth/getAllAccountData';
        break;
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
    }
    return (dispatch) => api.get(apiPath, {}).then((response) => {
        dispatch({
            type   : GET_CONTACTS,
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

export function toggleInSelectedContacts(contactId)
{
    return {
        type: TOGGLE_IN_SELECTED_CONTACTS,
        contactId
    }
}


export function selectAllContacts()
{
    return {
        type: SELECT_ALL_CONTACTS
    }
}

export function deSelectAllContacts()
{
    return {
        type: DESELECT_ALL_CONTACTS
    }
}


export function openNewContactDialog()
{
    return {
        type: OPEN_NEW_CONTACT_DIALOG
    }
}

export function closeNewContactDialog()
{
    return {
        type: CLOSE_NEW_CONTACT_DIALOG
    }
}

export function openEditContactDialog(data)
{
    return {
        type: OPEN_EDIT_CONTACT_DIALOG,
        data
    }
}

export function closeEditContactDialog()
{
    return {
        type: CLOSE_EDIT_CONTACT_DIALOG
    }
}

export function addContact(newAccount)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = api.post('/auth/addAccountData', {
            newAccount
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: ADD_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function updateContact(contact)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = api.post('/auth/updateAccountData', {
            contact
        });

        console.log(contact);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function removeContact(accountId)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = api.post('/auth/removeAccountData', {
            accountId
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}


export function removeContacts(accountIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = api.post('/auth/removeAccountsData', {
            accountIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_CONTACTS
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function toggleStarredContact(contactId)
{
    return (dispatch, getState) => {
        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/toggle-starred-contact', {
            contactId
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: TOGGLE_STARRED_CONTACT
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function toggleStarredContacts(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/toggle-starred-contacts', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: TOGGLE_STARRED_CONTACTS
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function setContactsStarred(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/set-contacts-starred', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: SET_CONTACTS_STARRED
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function setContactsUnstarred(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/set-contacts-unstarred', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: SET_CONTACTS_STARRED
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}
