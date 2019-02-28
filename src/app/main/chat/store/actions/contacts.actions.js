import api from 'app/ApiConfig';
import {setselectedEventId} from './events.actions';
import {removeChat} from './chat.actions';

export const GET_CONTACTS = '[CHAT APP] GET CONTACTS';
export const SET_SELECTED_CONTACT_ID = '[CHAT APP] SET SELECTED CONTACT ID';
export const REMOVE_SELECTED_CONTACT_ID = '[CHAT APP] REMOVE SELECTED CONTACT ID';

export function getContacts(event_id, contactFilter)
{
    const request = api.post('/chat/getContacts', {event_id, filter: contactFilter});

    // console.log(event_id);

    return (dispatch) =>
        request.then((response) => {
            dispatch(setselectedEventId(event_id));
            dispatch(removeSelectedContactId());
            // dispatch(removeChat());
            return dispatch({
                type   : GET_CONTACTS,
                payload: response.data.doc
            });
        });
}

export function setArchived(event_id, contact_id) {
    const request = api.post('/chat/setArchived', {event_id, filter: "Archived", contact_id});

    return (dispatch) =>
        request.then((response) => {
            dispatch(setselectedEventId(event_id));
            dispatch(removeSelectedContactId());
            dispatch(removeChat());
            return dispatch({
                type   : GET_CONTACTS,
                payload: response.data.doc
            });
        });
}

export function setselectedContactId(contactId)
{
    return {
        type   : SET_SELECTED_CONTACT_ID,
        payload: contactId
    }
}

export function removeSelectedContactId()
{
    return {
        type: REMOVE_SELECTED_CONTACT_ID
    }
}
