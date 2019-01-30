import api from 'app/ApiConfig'
import {showMessage} from 'app/store/actions/fuse';
// import {FuseUtils} from '@fuse';

export const GET_EVENT = '[E-COMMERCE APP] GET EVENT';
export const SAVE_EVENT = '[E-COMMERCE APP] SAVE EVENT';
export const ADD_EVENT = '[E-COMMERCE APP] ADD EVENT';

export function getEvent(params)
{
    const request = api.post('/events/getEventById', {_id: params.eventId});

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_EVENT,
                payload: response.data.doc
            })
        );
}

export function saveEvent(data)
{
    const request = api.post('/events/updateEvent', {event: data});

    return (dispatch) =>
        request.then((response) => {

                dispatch(showMessage({message: 'Event Saved'}));

                return dispatch({
                    type   : SAVE_EVENT,
                    payload: response.data.doc
                })
            }
        );
}

export function addEvent(data)
{
    const request = api.post('/events/addEvent', {event: data});

    return (dispatch) =>
        request.then((response) => {

                dispatch(showMessage({message: 'Event Saved'}));

                return dispatch({
                    type   : ADD_EVENT,
                    payload: response.data.doc
                })
            }
        );
}

export function newEvent()
{
    const data = {
        // _id              : FuseUtils.generateGUID(),
        employer_id     : 0,
        employer_name   : '',
        employer_email  : '',
        name            : '',
        description     : '',
        category        : [],
        type            : [],
        event_state     : 'Progress',
        website_url     : '',
        cost_min        : 0,
        cost_max        : 0,
        gender          : 'MF',
        age_min         : 0,
        age_max         : 99,
        language        : 'English',
        currency_type   : 'USD',
        quantity        : 0,
        lat             : 0,
        lng             : 0,
        visitors        : 0,
        friend_offer    : [],
        friend_join     : [],
    };

    return {
        type   : GET_EVENT,
        payload: data
    }
}
