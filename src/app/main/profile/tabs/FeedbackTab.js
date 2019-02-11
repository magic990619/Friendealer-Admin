import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
    Paper,
    Input,
    Icon,
    Tooltip,
} from '@material-ui/core';
import {FuseAnimateGroup, FuseUtils, FuseAnimate} from '@fuse';
import api from 'app/ApiConfig';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FeedbackDialog from './FeedbackDialog';
import moment from 'moment/moment';
import StarRatingComponent from 'react-star-rating-component';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function createdata(event, overall_rating) {
    return {
        event_id : event.event_id,
        created_at: event.created_at,
        event_name: event.event_name,
        feedback: event.feedback,
        delivered_budget: event.delivered_budget,
        delivered_time: event.delivered_time,
        rating_clarity: event.rating_clarity,
        rating_quality: event.rating_quality,
        rating_communication: event.rating_communication,
        rating_expertise: event.rating_expertise,
        rating_payment: event.rating_payment,
        rating_professionalism: event.rating_professionalism,
        rating_hire_again: event.rating_hire_again,
        rating_work_again: event.rating_work_again,
        photo: event.photo,
        overall_rating: overall_rating,
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
    { id: 'feedback', numeric: false, disablePadding: false, label: 'Feedback' },
    { id: 'delivered_budget', numeric: false, disablePadding: false, label: 'Delivered on budget' },
    { id: 'delivered_time', numeric: false, disablePadding: false, label: 'Delivered on time' },
    { id: 'overall_rating', numeric: true, disablePadding: true, label: 'Overall Rating' },
    { id: 'action', numeric: true, disablePadding: false, label: 'Action' },
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

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

class FeedbackTab extends Component {

    state = {
        person    : false,
        refresh     : false, 
        open: false,
        searchText: '',
        order: 'asc',
        orderBy: 'created_at',
        row: {
            joiner_email: '',
            employeer_email: '',
            event_id: '',
            event_name: '',
            delivered_budget: 'Yes',
            delivered_time: 'Yes',
            rating_clarity: '',
            rating_quality: '',
            rating_communication: '',
            rating_payment: '',
            rating_expertise: '',
            rating_professionalism: '',
            rating_work_again: '',
            rating_hire_again: '',
            photo: [],
            feedback: '',
            created_at: '',
        },
        profileData: {
            user_id: '',
            provide_feedback: [{
                joiner_email: '',
                event_id: '',
                event_name: '',
                delivered_budget: 'Yes',
                delivered_time: 'Yes',
                rating_quality: '',
                rating_communication: '',
                rating_expertise: '',
                rating_professionalism: '',
                rating_hire_again: '',
                photo: [],
                feedback: '',
                created_at: '',        
            }],
            receive_feedback: [{
                employeer_email: '',
                event_id: '',
                event_name: '',
                delivered_budget: 'Yes',
                delivered_time: 'Yes',
                rating_clarity: '',
                rating_communication: '',
                rating_payment: '',
                rating_professionalism: '',
                rating_work_again: '',
                photo: [],
                feedback: '',
                created_at: '',      
            }],
        },
    };

    componentDidMount()
    {
        this.getUserProfile();
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
      };

    getUserProfile = () => {
        const {user_id} = this.props;

        api.post('/profile/getUserProfileById', {
            user_id
        }).then(res => {
            this.setState({ profileData: res.data.doc });
        });

    }

    handlePersonChange = () => {
        this.setState({
            person: !this.state.person,
        });
    };

    handleSave = () => {
        var profile = this.state.profileData;
        api.post('/profile/saveUserProfileById', {
            profile
        });
    }

    handleDeleteEvent = (event_id) => {
        var profile = this.state.profileData;
        var events = this.state.person === false ? profile.posted_event : profile.offered_event;
        var res = [];
        events.forEach(function(cursor, err) {
            if (cursor.event_id.localeCompare(event_id) !== 0) {
                res.push(cursor);
            }
        });
        if (this.state.person === false)
            profile.posted_event = res;
        else
            profile.offered_event = res;
        console.log(res);
        this.setState({ profileData: profile });
        this.handleSave();
    }

    handleRefresh = () => {
        this.setState({refresh : !this.state.refresh});
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
        const {order, orderBy} = this.state;
        const {event_id} = this.props;
        const {person} = this.state;
        const provide_feedback = this.state.profileData === null ? null : this.state.profileData.provide_feedback;
        const receive_feedback = this.state.profileData === null ? null : this.state.profileData.receive_feedback;
        var feedbacks = (person === false ? provide_feedback : receive_feedback);

        var res = [];
        if (feedbacks !== null) {
            feedbacks = this.getFilteredArray(feedbacks, this.state.searchText);
            feedbacks && feedbacks.map((row) => {
                if (event_id === undefined || parseInt(row.event_id) === parseInt(event_id)) {
                    res.push(createdata(row, person === false ? ((row.rating_communication + row.rating_expertise + row.rating_quality
                        + row.rating_professionalism + row.rating_hire_again) / 5) : ((row.rating_communication + row.rating_payment + row.rating_clarity
                        + row.rating_professionalism + row.rating_work_again) / 5)));
                }
                return null;
            });

            res = stableSort(res, getSorting(order, orderBy));
        }

        return (
            <div className="min-w-full">
                <div className="flex min-w-full">
                    <Typography className="inline font-medium mr-4" color="primary" paragraph={false} variant="h6">
                        Joiner
                    </Typography>
                    <Switch
                        checked={this.state.person}
                        onChange={this.handlePersonChange}
                        value="person"
                        color="primary"
                        size="large"
                    />
                    <Typography className="inline font-medium mr-4" color="primary" paragraph={false} variant="h6">
                        Employer
                    </Typography>
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
                </div>
                <div className="md:flex max-w-full">
                    <div className="flex flex-col flex-1 md:pr-32">
                        <FuseAnimateGroup
                            enter={{
                                animation: "transition.slideUpBigIn"
                            }}
                            >
                            <Table>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                />
                                <TableBody>
                                    {res && res.map(row => {
                                        return (
                                        <TableRow key={row.event_id}>
                                            <CustomTableCell component="th" scope="row">
                                            {moment(row.created_at).format('YYYY/MM/DD hh:mm:ss A')}
                                            </CustomTableCell>
                                            <CustomTableCell align="center">{row.event_name}</CustomTableCell>
                                            <CustomTableCell align="center">{row.feedback}</CustomTableCell>
                                            <CustomTableCell align="center">{row.delivered_budget}</CustomTableCell>
                                            <CustomTableCell align="center">{row.delivered_time}</CustomTableCell>
                                            <CustomTableCell align="center" width="220">
                                                <div className="flex flex-row">
                                                    <div className="flex bg-blue mt-6 rounded-2 w-24 h-24 justify-center">
                                                        <p className="text-white p-4">{(person === false ? ((row.rating_communication + row.rating_expertise + row.rating_quality
                                                + row.rating_professionalism + row.rating_hire_again) / 5) : ((row.rating_communication + row.rating_payment + row.rating_clarity
                                                    + row.rating_professionalism + row.rating_work_again) / 5)).toFixed(1)}</p>
                                                    </div>
                                                    <StarRatingComponent className="text-18 my-auto ml-6"
                                                        name="overall_rating" 
                                                        starCount={5}
                                                        value={person === false ? ((row.rating_communication + row.rating_expertise + row.rating_quality
                                                            + row.rating_professionalism + row.rating_hire_again) / 5) : ((row.rating_communication + row.rating_payment + row.rating_clarity
                                                                + row.rating_professionalism + row.rating_work_again) / 5)}
                                                        editing={false}
                                                        starColor="#ffb400"
                                                        emptyStarColor="#ffb400"
                                                        renderStarIcon={(index, value) => {
                                                            return (
                                                            <span>
                                                                <i className={index <= value ? 'fas fa-star' : 'far fa-star'} />
                                                            </span>
                                                            );
                                                        }}
                                                        renderStarIconHalf={() => {
                                                            return (
                                                            <span>
                                                                <span style={{position: 'absolute'}}><i className="far fa-star" /></span>
                                                                <span><i className="fas fa-star-half" /></span>
                                                            </span>
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </CustomTableCell>
                                            <CustomTableCell align="center">
                                                <FeedbackDialog person={person} row={row} profileData={this.state.profileData} onRefresh={this.handleRefresh}/>
                                            </CustomTableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {(res === null || res.length === 0) && 
                                <Typography className="inline font-medium mr-4" color="primary" paragraph={false} variant="h6">
                                    No feedbacks found.
                                </Typography>
                            }
                        </FuseAnimateGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default FeedbackTab;