import * as Actions from '../actions';

const initialState = {
    data      : [],
    searchText: ''
};

const eventsReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_EVENTS:
        {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.REMOVE_EVENT:
        {
            return {
                ...state
            };
        }
        case Actions.SET_EVENTS_SEARCH_TEXT:
        {
            return {
                ...state,
                searchText: action.searchText
            };
        }
        default:
        {
            return state;
        }
    }
};

export default eventsReducer;
