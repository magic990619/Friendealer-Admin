import * as Actions from '../actions';

const initialState = {
    role: 'guest',
    user_name: '',
    // data: {
    //     'displayName': 'John Doe',
    //     'photoURL'   : 'assets/images/avatars/Velazquez.jpg',
    //     'email'      : 'johndoe@withinpixels.com',
    //     shortcuts    : [
    //         'calendar',
    //         'mail',
    //         'contacts',
    //         'todo'
    //     ]
    // }
};
// const initialState = null;

const user = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SET_USER_DATA:
        {
            return {
                ...initialState,
                ...action.payload
            };
        }
        case Actions.REMOVE_USER_DATA:
        {
            return {
                ...initialState
            };
        }
        case Actions.USER_LOGGED_OUT:
        {
            return initialState;
        }
        default:
        {
            return state
        }
    }
};

export default user;
