import axios from 'axios';
import api from 'app/ApiConfig'
import {FuseUtils} from '@fuse';
import {showMessage} from 'app/store/actions/fuse';

export const GET_EVENT = '[E-COMMERCE APP] GET EVENT';
export const SAVE_EVENT = '[E-COMMERCE APP] SAVE EVENT';

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

export function newEvent()
{
    const data = {
        // id              : FuseUtils.generateGUID(),
        name            : '',
        description     : '',
        category        : [],
        type            : [],
        website_url     : '',
        cost_min        : 0,
        cost_max        : 0,
        gender          : 'MF',
        age_min         : 0,
        age_max         : 99,
        language        : 'English',
        currency_type   : 'USD',
        quantity        : 0,
        lst             : 0,
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
