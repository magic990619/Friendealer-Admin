import * as Actions from '../actions';

const initialState = {
    data: null
};

const eventReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_EVENT:
        {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.SAVE_EVENT:
        {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.ADD_EVENT:
        {
            return {
                ...state,
                data: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
};

export default eventReducer;
