import React, {Component} from 'react';
import {
    Typography
} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
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

        api.post('/auth/getUserProfileById', {
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
        api.post('/auth/saveUserProfileById', {
            profile
        });
    }

    handleDeleteEvent = (event_id) => {
        var profile = this.state.profileData;
        var events = this.state.person == 0 ? profile.posted_event : profile.offered_event;
        var res = [];
        events.forEach(function(cursor, err) {
            if (cursor.event_id.localeCompare(event_id) !== 0) {
                res.push(cursor);
            }
        });
        if (this.state.person == 0)
            profile.posted_event = res;
        else
            profile.offered_event = res;
        console.log(res);
        this.setState({ profileData: profile });
        this.handleSave();
    }

    render()
    {
        const {person} = this.state;
        var provide_feedback = this.state.profileData === null ? null : this.state.profileData.provide_feedback;
        var receive_feedback = this.state.profileData === null ? null : this.state.profileData.receive_feedback;

        return (
            <div>
                <div className="max-w-full">
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
                                    <CustomTableCell align="right">Event Name</CustomTableCell>
                                    <CustomTableCell align="right">Feedback</CustomTableCell>
                                    <CustomTableCell align="right">Overall Rating</CustomTableCell>
                                    <CustomTableCell align="right"></CustomTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {person == 0 && provide_feedback && provide_feedback.map(row => {
                                        return (
                                        <TableRow key={row.event_id}>
                                            <CustomTableCell component="th" scope="row">
                                            {row.created_at}
                                            </CustomTableCell>
                                            <CustomTableCell align="right">{row.event_name}</CustomTableCell>
                                            <CustomTableCell align="right">{row.feedback}</CustomTableCell>
                                            <CustomTableCell align="right">{(row.rating_communication + row.rating_expertise + row.rating_quality
                                                + row.rating_professionalism + row.rating_hire_again) / 5}</CustomTableCell>
                                            <CustomTableCell align="right">
                                                <FeedbackDialog person={person} row={row} profileData={this.state.profileData} />
                                            </CustomTableCell>
                                        </TableRow>
                                        );
                                    })}
                                    {person == 1 && receive_feedback && receive_feedback.map(row => {
                                        return (
                                        <TableRow key={row.event_id}>
                                            <CustomTableCell component="th" scope="row">
                                            {row.created_at}
                                            </CustomTableCell>
                                            <CustomTableCell align="right">{row.event_name}</CustomTableCell>
                                            <CustomTableCell align="right">{row.feedback}</CustomTableCell>
                                            <CustomTableCell align="right">{(row.rating_communication + row.rating_clarity + row.rating_payment
                                                + row.rating_professionalism + row.rating_work_again) / 5}</CustomTableCell>
                                            <CustomTableCell align="right">
                                                <FeedbackDialog person={person} row={row} profileData={this.state.profileData} />
                                            </CustomTableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </FuseAnimateGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default FeedbackTab;
