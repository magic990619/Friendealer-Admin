import React, {Component} from 'react';
import api from 'app/ApiConfig'
import {withStyles, Avatar, Button, Tab, Tabs, Typography} from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import EventFeedbackTab from './tabs/EventFeedbackTab';
import PhotosVideosTab from './tabs/PhotosVideosTab';
import AboutTab from './tabs/AboutTab';

const styles = theme => ({
    layoutHeader : {
        height                        : 320,
        minHeight                     : 320,
        [theme.breakpoints.down('md')]: {
            height   : 240,
            minHeight: 240
        }
    }
});

class ProfilePage extends Component {

    state = {
        value: 0,
        accountData: [],
    };

    componentDidMount()
    {
        var user_id = this.props.match.params;

        api.post('/auth/getAccountDataById', {
            user_id
        }).then(res => {
            this.setState({ accountData: res.data.doc });
//            console.log(res.data.doc);
        });
    }


    handleChange = (event, value) => {
        this.setState({value});
    };

    render()
    {
        const {value} = this.state;
        var user_id = this.state.accountData._id;

        return (
            <FusePageSimple
                classes={{
                    // header : classes.layoutHeader,
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Avatar className="w-96 h-96" src={this.state.accountData.avatar}/>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="md:ml-24" variant="h4" color="inherit">{this.state.accountData.user_name}</Typography>
                            </FuseAnimate>
                        </div>

                        <div className="flex items-center justify-end">
                            <Button className="mr-8 normal-case" variant="contained" color="secondary" aria-label="Follow">Follow</Button>
                            <Button className="normal-case" variant="contained" color="primary" aria-label="Send Message">Send Message</Button>
                        </div>
                    </div>
                }
                contentToolbar={
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="off"
                        classes={{
                            root: "h-64 w-full border-b-1"
                        }}
                    >
                        <Tab
                            classes={{
                                root: "h-64"
                            }} label="About"/>
                        <Tab
                            classes={{
                                root: "h-64"
                            }}
                            label="Event & Feedback"/>
                        <Tab
                            classes={{
                                root: "h-64"
                            }} label="Photos & Videos"/>
                    </Tabs>
                }
                content={
                    <div className="p-16 sm:p-24">
                        {value === 0 && user_id !== undefined &&
                        (
                            <AboutTab user_id={user_id} />
                        )}
                        {value === 1 && user_id !== undefined && (
                            <EventFeedbackTab user_id={user_id}/>
                        )}
                        {value === 2 && user_id !== undefined && (
                            <PhotosVideosTab user_id={user_id}/>
                        )}
                    </div>
                }
            />
        )
    };
}

export default withStyles(styles, {withTheme: true})(ProfilePage);