import {combineReducers} from 'redux';
import categoriesReducer from './categories.reducer';

const reducer = combineReducers({
    categoriesReducer,
});

export default reducer;
