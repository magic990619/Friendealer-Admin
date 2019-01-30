import * as Actions from '../actions';

const initialState = {
    categories  : [],
}

const categoriesReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_CATEGORIES:
        {
            return {
                // ...state,
                categories: action.payload
            };
        }
        case Actions.UPDATE_CATEGORY:
        {
            return {
                // ...state,
                categories: action.payload
            };
        }
        case Actions.ADD_CATEGORY:
        {
            return {
                // ...state,
                categories: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
};

export default categoriesReducer;
