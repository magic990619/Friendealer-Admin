import React, {Component} from 'react';
import {
    Icon,
    IconButton,
    Typography,
} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Badge from '@material-ui/core/Badge';
import Radio from '@material-ui/core/Radio';

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
class EventTab extends Component {

    state = {
        selectedValue: "0",
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

        api.post('/auth/getUserProfileById', {
            user_id
        }).then(res => {
            this.setState({ profileData: res.data.doc });
        });

    }

    handleSave = () => {
        var profile = this.state.profileData;
        api.post('/auth/saveUserProfileById', {
            profile
        });
    }

    handleDeleteEvent = (event_id) => {
        var profile = this.state.profileData;
        var res = [];
        profile.posted_event.forEach(function(cursor, err) {
            if (cursor.event_id.localeCompare(event_id) !== 0) {
                res.push(cursor);
            }
        });
        profile.posted_event = res;
        res = [];
        profile.offered_event.forEach(function(cursor, err) {
            if (cursor.event_id.localeCompare(event_id) !== 0) {
                res.push(cursor);
            }
        });
        profile.offered_event = res;
        this.setState({ profileData: profile });
        this.handleSave();
    }

    handleChange = (event) => {
        this.setState({selectedValue: event.target.value});
    }

    render()
    {
        const {selectedValue} = this.state;
        var posted_events = this.state.profileData === null ? null : this.state.profileData.posted_event;
        var offered_events = this.state.profileData === null ? null : this.state.profileData.offered_event;
        var count_all = 0, count_posted = 0, count_offered = 0, count_finished = 0, count_progress = 0;

        var res = [];
        posted_events && posted_events.map((event) => {
            count_all ++;
            count_posted ++;
            if (selectedValue === '0' || selectedValue === '1')
                res.push(event);
            if (event.event_state === "Finished") {
                count_finished ++;
                if (selectedValue === '3')
                    res.push(event);
            }
            if (event.event_state === "Progress") {
                count_progress ++;
                if (selectedValue === '4')
                    res.push(event);
            }
            return null;
        });
        posted_events = res;
        res = [];
        offered_events && offered_events.map((event) => {
            count_all ++;
            count_offered ++;
            if (selectedValue === '0' || selectedValue === '2')
                res.push(event);
            if (event.event_state === "Finished") {
                count_finished ++;
                if (selectedValue === '3')
                    res.push(event);
            }
            if (event.event_state === "Progress") {
                count_progress ++;
                if (selectedValue === '4')
                    res.push(event);
            }
            return null;
        });
        offered_events = res;

        return (
            <div className="flex flex-col flex-1 md:pr-32">
                <div className="flex max-w-full m-20">
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
                <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                    >
                    <Table>
                        <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Created At</CustomTableCell>
                            <CustomTableCell align="center">Event Name</CustomTableCell>
                            <CustomTableCell align="center">Event Type</CustomTableCell>
                            <CustomTableCell align="center">Event State</CustomTableCell>
                            <CustomTableCell align="center"></CustomTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {posted_events && selectedValue !== "2" && posted_events.map((activity) => (
                                <TableRow key={activity.event_id}>
                                    <CustomTableCell align="center">{activity.created_at}</CustomTableCell>
                                    <CustomTableCell align="center">{activity.event_name}</CustomTableCell>
                                    <CustomTableCell align="center">Posted</CustomTableCell>
                                    <CustomTableCell align="center">{activity.event_state}</CustomTableCell>
                                    <CustomTableCell align="center">
                                        <IconButton
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                if (window.confirm('Are you sure to delete it?')) {
                                                    this.handleDeleteEvent(activity.event_id);
                                                }
                                            }}
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </CustomTableCell>
                                </TableRow>
                            ))}
                            {offered_events && selectedValue !== "1" && offered_events.map((activity) => (
                                <TableRow key={activity.event_id}>
                                    <CustomTableCell align="center">{activity.created_at}</CustomTableCell>
                                    <CustomTableCell align="center">{activity.event_name}</CustomTableCell>
                                    <CustomTableCell align="center">Offered</CustomTableCell>
                                    <CustomTableCell align="center">{activity.event_state}</CustomTableCell>
                                    <CustomTableCell align="center">
                                        <IconButton
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                if (window.confirm('Are you sure to delete it?')) {
                                                    this.handleDeleteEvent(activity.event_id);
                                                }
                                            }}
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </CustomTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {offered_events.length + posted_events.length === 0 && 
                                <Typography className="inline font-medium mr-4" color="primary" paragraph={false} variant="h6">
                                    There are no events.
                                </Typography>
                            }
                </FuseAnimateGroup>
            </div>
        );
    }
}

export default EventTab;
