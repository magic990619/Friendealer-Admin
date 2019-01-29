import axios from 'axios';
import api from 'app/ApiConfig'

export const GET_EVENTS = '[E-COMMERCE APP] GET EVENTS';
export const SET_EVENTS_SEARCH_TEXT = '[E-COMMERCE APP] SET EVENTS SEARCH TEXT';

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

export function setEventsSearchText(event)
{
    return {
        type      : SET_EVENTS_SEARCH_TEXT,
        searchText: event.target.value
    }
}

