import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import {
    Icon,
    Typography,
    Input,
    Paper,
    Tooltip,
} from '@material-ui/core';
import {FuseUtils, FuseAnimate} from '@fuse';
import api from 'app/ApiConfig';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Badge from '@material-ui/core/Badge';
import Radio from '@material-ui/core/Radio';
import history from 'history.js'
import moment from 'moment/moment';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function createdata(event, type) {
    return {
        event_id : event.event_id,
        created_at: moment(event.created_at).format('YYYY/MM/DD hh:mm:ss A'),
        event_name: event.event_name,
        event_type: type,
        event_state: event.event_state,
    }
}


function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'create_at', numeric: false, disablePadding: true, label: 'Created At' },
    { id: 'event_name', numeric: true, disablePadding: false, label: 'Event Name' },
    { id: 'event_type', numeric: true, disablePadding: false, label: 'Event Type' },
    { id: 'event_state', numeric: true, disablePadding: false, label: 'Event State' },
    // { id: 'action', numeric: true, disablePadding: false, label: 'Action' },
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
};

render() {
    const { order, orderBy } = this.props;

    return (
        <TableHead>
            <TableRow>
            {rows.map(row => {
                return (
                <TableCell
                    key={row.id}
                    align="center"
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === row.id ? order : false}
                >
                    <Tooltip
                    title="Sort"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                    >
                    <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                    >
                        {row.label}
                    </TableSortLabel>
                    </Tooltip>
                </TableCell>
                );
            }, this)}
            </TableRow>
        </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};
  
class EventTab extends Component {

    state = {
        selectedValue: "0",
        searchText: '', 
        order: 'asc',
        orderBy: 'created_at',
        selected: '',
        profileData: {
            user_id: '',
            posted_event: [{
                event_id: '',
                event_name: '',
                event_state: '',
                created_at: '',
            }],
            offered_event: [{
                event_id: '',
                event_name: '',
                event_state: '',
                created_at: '',
            }],
        },
    };

    componentDidMount()
    {
        this.getUserProfile();
    }

    getUserProfile = () => {
        const {user_id} = this.props;

        api.post('/profile/getUserProfileById', {
            user_id
        }).then(res => {
            this.setState({ profileData: res.data.doc });
        });

    }

    handleSave = () => {
        var profile = this.state.profileData;
        api.post('/profile/saveUserProfileById', {
            profile
        });
    }

    handleDeleteEvent = (event_id) => {
        var profile = this.state.profileData;
        var res = [];
        profile.posted_event.forEach(function(cursor, err) {
            if (cursor.event_id !== event_id) {
                res.push(cursor);
            }
        });
        profile.posted_event = res;
        res = [];
        profile.offered_event.forEach(function(cursor, err) {
            if (cursor.event_id !== event_id) {
                res.push(cursor);
            }
        });
        profile.offered_event = res;
        this.setState({ profileData: profile });
        this.handleSave();
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
      };
    
    handleChange = (event) => {
        this.setState({selectedValue: event.target.value});
    }

    setSearchText = event => {
        this.setState({searchText: event.target.value});
    }

    getFilteredArray = (entities, searchText) => {
        const arr = Object.keys(entities).map((id) => entities[id]);
        if ( searchText.length === 0 )
        {
            return arr;
        }
        return FuseUtils.filterArrayByString(arr, searchText);
    };

    render()
    {
        const {selectedValue, order, orderBy} = this.state;
        var posted_events = this.state.profileData === null ? null : this.state.profileData.posted_event;
        var offered_events = this.state.profileData === null ? null : this.state.profileData.offered_event;
        var count_all = 0, count_posted = 0, count_offered = 0, count_finished = 0, count_progress = 0;

        var res = [];
        posted_events && posted_events.map((event) => {
            count_all ++;
            count_posted ++;
            if (selectedValue === '0' || selectedValue === '1')
                res.push(createdata(event, 'Posted'));
            if (event.event_state === "Finished") {
                count_finished ++;
                if (selectedValue === '3')
                    res.push(createdata(event, 'Posted'));
            }
            if (event.event_state === "Progress") {
                count_progress ++;
                if (selectedValue === '4')
                    res.push(createdata(event, 'Posted'));
            }
            return null;
        });
        offered_events && offered_events.map((event) => {
            count_all ++;
            count_offered ++;
            if (selectedValue === '0' || selectedValue === '2')
                res.push(createdata(event, 'Offered'));
            if (event.event_state === "Finished") {
                count_finished ++;
                if (selectedValue === '3')
                    res.push(createdata(event, 'Offered'));
            }
            if (event.event_state === "Progress") {
                count_progress ++;
                if (selectedValue === '4')
                    res.push(createdata(event, 'Offered'));
            }
            return null;
        });
        res = this.getFilteredArray(res, this.state.searchText);
        res = stableSort(res, getSorting(order, orderBy));

        return (
            <div className="flex flex-col flex-1 md:pr-32">
                <div className="flex max-w-full m-20 flex-row justify-center text-center">
                    <div className="min-w-320">
                        <Badge color="primary" badgeContent={count_all} >
                            <Radio checked={selectedValue === "0"} onChange={this.handleChange} value="0" name="all_events"/>
                            <Typography className="font-medium mr-4 text-center py-8" color="primary" paragraph={false} variant="h6">ALL EVENTS</Typography>
                        </Badge>
                    </div>
                    <div className="min-w-320">
                        <Badge color="primary" badgeContent={count_posted} >
                            <Radio checked={selectedValue === "1"} onChange={this.handleChange} value="1" name="posted_events"/>
                            <Typography className="font-medium mr-4 text-center py-8" color="primary" paragraph={false} variant="h6">POSTED EVENTS</Typography>
                        </Badge>
                    </div>
                    <div className="min-w-320">
                        <Badge color="primary" badgeContent={count_offered} >
                            <Radio checked={selectedValue === "2"} onChange={this.handleChange} value="2" name="offered_events"/>
                            <Typography className="font-medium mr-4 text-center py-8" color="primary" paragraph={false} variant="h6">OFFERED EVENTS</Typography>
                        </Badge>
                    </div>
                    <div className="min-w-320">
                        <Badge color="primary" badgeContent={count_finished} >
                            <Radio checked={selectedValue === "3"} onChange={this.handleChange} value="3" name="finished_events"/>
                            <Typography className="font-medium mr-4 text-center py-8" color="primary" paragraph={false} variant="h6">FINISHED EVENTS</Typography>
                        </Badge>
                    </div>
                    <div className="min-w-320">
                        <Badge color="primary" badgeContent={count_progress} >
                            <Radio checked={selectedValue === "4"} onChange={this.handleChange} value="4" name="progress_events"/>
                            <Typography className="font-medium mr-4 text-center py-8" color="primary" paragraph={false} variant="h6">PROGRESS EVENTS</Typography>
                        </Badge>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>
                            <Icon className="mr-8" color="action">search</Icon>
                            <Input
                                placeholder="Search for anything"
                                className="flex flex-1"
                                disableUnderline
                                fullWidth
                                value={this.state.searchText}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                onChange={this.setSearchText}
                            />
                        </Paper>
                    </FuseAnimate>
                </div>
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <ReactTable
                        className="-striped -highlight border-0"
                        getTrProps={(state, rowInfo, column) => {
                            return {
                                className: "cursor-pointer",
                                onClick  : (e, handleOriginal) => {
                                    if ( rowInfo )
                                    {
                                        history.push('/events/events/' + rowInfo.original.event_id);
                                    }
                                }
                            }
                        }}
                        data={res}
                        columns={[
                            {
                                Header    : "Created At",
                                accessor  : "created_at",
                                filterable: true,
                                className : "font-bold"
                            },
                            {
                                Header    : "Event Name",
                                accessor  : "event_name",
                                filterable: true,
                                className : "font-bold"
                            },
                            {
                                Header    : "Event Type",
                                accessor  : "event_type",
                                filterable: true
                            },
                            {
                                Header    : "Event State",
                                accessor  : "event_state",
                                filterable: true
                            },
                        ]}
                        defaultPageSize={10}
                        noDataText="No events found"
                    />
                </FuseAnimate>
            </div>
        );
    }
}
  
export default EventTab;
