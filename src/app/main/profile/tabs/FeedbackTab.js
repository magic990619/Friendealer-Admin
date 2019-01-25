import React, {Component} from 'react';
import {
    Typography,
    Paper,
    Input,
    Icon,
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
import FeedbackDialog from './FeedbackDialog';

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
        row: {
            joiner_email: '',
            employeer_email: '',
            event_id: '',
            event_name: '',
            rating_clarity: '',
            rating_quality: '',
            rating_communication: '',
            rating_payment: '',
            rating_expertise: '',
            rating_professionalism: '',
            rating_work_again: '',
            rating_hire_again: '',
            feedback: '',
            created_at: '',
        },
        profileData: {
            user_id: '',
            provide_feedback: [{
                joiner_email: '',
                event_id: '',
                event_name: '',
                rating_quality: '',
                rating_communication: '',
                rating_expertise: '',
                rating_professionalism: '',
                rating_hire_again: '',
                feedback: '',
                created_at: '',        
            }],
            receive_feedback: [{
                employeer_email: '',
                event_id: '',
                event_name: '',
                rating_clarity: '',
                rating_communication: '',
                rating_payment: '',
                rating_professionalism: '',
                rating_work_again: '',
                feedback: '',
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
        const {person} = this.state;
        const provide_feedback = this.state.profileData === null ? null : this.state.profileData.provide_feedback;
        const receive_feedback = this.state.profileData === null ? null : this.state.profileData.receive_feedback;
        var feedbacks = (person === false ? provide_feedback : receive_feedback);

        feedbacks = this.getFilteredArray(feedbacks, this.state.searchText);

        console.log(feedbacks);

        return (
            <div>
                <div className="flex max-w-full">
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
                        Employeer
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
                                <TableHead>
                                <TableRow>
                                    <CustomTableCell>Created At</CustomTableCell>
                                    <CustomTableCell align="center">Event Name</CustomTableCell>
                                    <CustomTableCell align="center">Feedback</CustomTableCell>
                                    <CustomTableCell align="center">Overall Rating</CustomTableCell>
                                    <CustomTableCell align="center"></CustomTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {feedbacks && feedbacks.map(row => {
                                        return (
                                        <TableRow key={row.event_id}>
                                            <CustomTableCell component="th" scope="row">
                                            {row.created_at}
                                            </CustomTableCell>
                                            <CustomTableCell align="center">{row.event_name}</CustomTableCell>
                                            <CustomTableCell align="center">{row.feedback}</CustomTableCell>
                                            <CustomTableCell align="center">{person === false ? ((row.rating_communication + row.rating_expertise + row.rating_quality
                                                + row.rating_professionalism + row.rating_hire_again) / 5) : ((row.rating_communication + row.rating_payment + row.rating_clarity
                                                    + row.rating_professionalism + row.rating_work_again) / 5)}</CustomTableCell>
                                            <CustomTableCell align="center">
                                                <FeedbackDialog person={person} row={row} profileData={this.state.profileData} onRefresh={this.handleRefresh}/>
                                            </CustomTableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {(feedbacks === null || feedbacks.length === 0) && 
                                        <Typography className="inline font-medium mr-4" color="primary" paragraph={false} variant="h6">
                                            There are no feedbacks.
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