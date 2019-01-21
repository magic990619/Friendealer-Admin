import api from 'app/ApiConfig.js'

export const GET_USER_DATA = '[CONTACTS APP] GET USER DATA';

export function getUserData()
{
    const request = api.get('/user');

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_USER_DATA,
                payload: response.data
            })
        );
}
