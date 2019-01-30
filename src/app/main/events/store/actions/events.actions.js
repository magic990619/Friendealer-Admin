import api from 'app/ApiConfig'

export const GET_EVENTS = '[EVENT] GET EVENTS';
export const REMOVE_EVENT = '[EVENT] GET EVENTS';
export const SET_EVENTS_SEARCH_TEXT = '[EVENT] SET EVENTS SEARCH TEXT';

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

export function removeEvent(params)
{
    const request = api.post('/events/removeEventById', {_id: params._id});

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : REMOVE_EVENT,
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

