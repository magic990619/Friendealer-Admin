import * as Actions from '../actions';

const initialState = {
    entities         : [],
    selectedEventId: null
};

const eventsReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_EVENTS:
        {
            return {
                ...state,
                entities: [...action.payload]
            };
        }
        case Actions.SET_SELECTED_EVENT_ID:
        {
            return {
                ...state,
                selectedEventId: action.payload
            };
        }
        case Actions.REMOVE_SELECTED_EVENT_ID:
        {
            return {
                ...state,
                selectedEventId: null
            };
        }
        default:
        {
            return state;
        }
    }
};

export default eventsReducer;