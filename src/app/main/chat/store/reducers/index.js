import sidebars from './sidebars.reducer';
import user from './user.reducer';
import contacts from './contacts.reducer';
import events from './events.reducer';
import chat from './chat.reducer';
import {combineReducers} from 'redux';

const reducer = combineReducers({
    sidebars,
    events,
    user,
    contacts,
    chat
});

export default reducer;
