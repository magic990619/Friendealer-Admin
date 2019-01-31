import React, {Component} from 'react';
import api from 'app/ApiConfig'
import {withStyles, Button, Typography, Icon, IconButton, } from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import _ from '@lodash';

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

class MembershipPage extends Component {

    state = {
    };


    render()
    {
        return (
            <FusePageSimple
                classes={{
                    // header : classes.layoutHeader,
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <div className="flex items-center">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-12">card_membership</Icon>
                                </FuseAnimate>
                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                    <Typography variant="h6" className="hidden sm:flex">Membership</Typography>
                                </FuseAnimate>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Button className="normal-case" variant="contained" color="primary" aria-label="Send Message">Send Message</Button>
                        </div>
                    </div>
                }
                content={
                    <div>

                    </div>
                }
            />
        );
    };
}

export default withStyles(styles, {withTheme: true})(MembershipPage);
