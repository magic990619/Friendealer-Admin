import axios from 'axios';
import api from 'app/ApiConfig';

export const GET_USER_DATA = '[CHAT APP] GET USER DATA';
export const UPDATE_USER_DATA = '[CHAT APP] UPDATE USER DATA';


export function getUserData(event_id)
{
    const request = api.post('/chat/getUserData', {event_id});

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_USER_DATA,
                payload: response.data.doc
            })
        );
}

export function updateUserData(newData)
{
    const request = axios.post('/api/chat/user/data', newData);

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : UPDATE_USER_DATA,
                payload: response.data
            })
        );
}
