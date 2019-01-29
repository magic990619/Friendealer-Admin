import {combineReducers} from 'redux';
import events from './events.reducer';
import event from './event.reducer';

const reducer = combineReducers({
    events,
    event,
});

export default reducer;
