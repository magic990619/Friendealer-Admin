import axios from 'axios';
import api from 'app/ApiConfig';

export const GET_EVENTS = '[CHAT APP] GET EVENTS';
export const SET_SELECTED_EVENT_ID = '[CHAT APP] SET SELECTED EVENT ID';
export const REMOVE_SELECTED_EVENT_ID = '[CHAT APP] REMOVE SELECTED EVENT ID';

export function getEvents()
{
    const request = api.post('/events/getAllEvents');
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_EVENTS,
                payload: response.data.doc
            })
        );
}

export function setselectedEventId(eventId)
{
    return {
        type   : SET_SELECTED_EVENT_ID,
        payload: eventId
    }
}

export function removeSelectedEventId()
{
    return {
        type: REMOVE_SELECTED_EVENT_ID
    }
}
