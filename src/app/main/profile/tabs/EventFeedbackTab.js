import React, {Component} from 'react';
import {
    AppBar,
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Icon,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemText,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import {Link} from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

class EventFeedbackTab extends Component {

    state = {
        person    : false,
        profileData: {
            user_id: '',
            provide_feedback: [{
                joiner_id: '',
                avatar: '',
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
                employeer_id: '',
                avatar: '',
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
        var posted_events = this.state.profileData === null ? null : this.state.profileData.posted_event;
        var offered_events = this.state.profileData === null ? null : this.state.profileData.offered_event;
        var provide_feedback = this.state.profileData === null ? null : this.state.profileData.provide_feedback;
        var receive_feedback = this.state.profileData === null ? null : this.state.profileData.receive_feedback;

        return (
            <div className="md:flex max-w-2xl">
                <div className="flex flex-col flex-1 md:pr-32">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                    <AppBar position="static" elevation={0}>
                        <Toolbar className="pl-16 pr-8">
                            <Typography variant="subtitle1" color="inherit" className="flex-1">
                                Feedback
                            </Typography>
                            {/* <Button color="inherit" size="small">See All</Button> */}
                        </Toolbar>
                    </AppBar>
                    {person == 0 && provide_feedback && provide_feedback.map((post) => (
                            <Card className="mb-32 overflow-hidden" key={post.event_id}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="Recipe" src={post.avatar}/>
                                    }
                                    action={
                                        <IconButton aria-label="more">
                                            <Icon>more_vert</Icon>
                                        </IconButton>
                                    }
                                    title={(
                                        <span>
                                            <Typography className="inline font-medium mr-4" color="primary" paragraph={false}>
                                                {post.event_name}
                                            </Typography>
                                        </span>
                                    )}
                                    subheader={post.created_at}
                                />
                                <CardContent className="py-0">
                                    {post.feedback && (
                                        <Typography component="p" className="mb-16">
                                            {post.feedback}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardContent className="py-0">
                                    {post.feedback && (
                                        <Typography component="p" className="mb-16">
                                            {post.feedback}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                            ))
                        }
                        {person == 1 && receive_feedback && receive_feedback.map((post) => (
                            <Card className="mb-32 overflow-hidden" key={post.event_id}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="Recipe" src={post.avatar}/>
                                    }
                                    action={
                                        <IconButton aria-label="more">
                                            <Icon>more_vert</Icon>
                                        </IconButton>
                                    }
                                    title={(
                                        <span>
                                            <Typography className="inline font-medium mr-4" color="primary" paragraph={false}>
                                                {post.event_name}
                                            </Typography>
                                        </span>
                                    )}
                                    subheader={post.created_at}
                                />
                                <CardContent className="py-0">
                                    {post.feedback && (
                                        <Typography component="p" className="mb-16">
                                            {post.feedback}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                            ))
                        }
                    </FuseAnimateGroup>

                </div>
                <div className="flex flex-col md:w-320">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <Card className="w-full">
                            <AppBar position="static" elevation={0}>
                                <Toolbar className="pl-16 pr-8">
                                    <Typography variant="subtitle1" color="inherit" className="flex-1">
                                        Events
                                    </Typography>
                                    {/* <Button color="inherit" size="small">See All</Button> */}
                                </Toolbar>
                            </AppBar>
                            <CardContent className="p-0">
                                <List>
                                    {person == 0 && posted_events && posted_events.map((activity) => (
                                        <ListItem key={activity.event_id} className="">
                                            <ListItemText
                                                className="flex-1"
                                                primary={(
                                                    <div className="truncate">
                                                        <Typography className="inline font-medium" color="primary" paragraph={false}>
                                                            {activity.event_name}
                                                        </Typography>

                                                        <Typography className="inline ml-4" paragraph={false}>
                                                            :{activity.event_state}
                                                        </Typography>
                                                    </div>
                                                )}
                                                secondary={activity.created_at}
                                            />
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
                                        </ListItem>
                                    ))}
                                    {person == 1 && offered_events && offered_events.map((activity) => (
                                        <ListItem key={activity.event_id} className="">
                                            <ListItemText
                                                className="flex-1"
                                                primary={(
                                                    <div className="truncate">
                                                        <Typography className="inline font-medium" color="primary" paragraph={false}>
                                                            {activity.event_name}
                                                        </Typography>

                                                        <Typography className="inline ml-4" paragraph={false}>
                                                            :{activity.event_state}
                                                        </Typography>
                                                    </div>
                                                )}
                                                secondary={activity.created_at}
                                            />
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
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </FuseAnimateGroup>
                </div>
                <div className="p-12">
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
            </div>
        );
    }
}

export default EventFeedbackTab;
