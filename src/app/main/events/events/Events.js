import React from 'react';
import {FusePageCarded} from '@fuse';
import withReducer from 'app/store/withReducer';
import EventsTable from './EventsTable';
import EventsHeader from './EventsHeader';
import reducer from '../store/reducers';

const Events = () => {
    return (
        <FusePageCarded
            classes={{
                content: "flex",
                header : "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                <EventsHeader/>
            }
            content={
                <EventsTable/>
            }
            innerScroll
        />
    );
};

export default withReducer('eCommerceApp', reducer)(Events);
