import React, {Component} from 'react';
import {withStyles, Button, Tab, Tabs, Typography} from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import CurrencyTab from './tabs/CurrencyTab';
import EventTypeTab from './tabs/EventTypeTab';
import EventStateTab from './tabs/EventStateTab';

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

class Basedata extends Component {

    state = {
        value: 0,
    };

    componentDidMount()
    {
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    render()
    {
        const {value} = this.state;

        return (
            <FusePageSimple
                classes={{
                    // header : classes.layoutHeader,
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="md:ml-24" variant="h4" color="inherit">Basedata Management</Typography>
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
                            }} label="Currency"/>
                        <Tab
                            classes={{
                                root: "h-64"
                            }}
                            label="Event Type"/>
                        <Tab
                            classes={{
                                root: "h-64"
                            }}
                            label="Event State"/>
                    </Tabs>
                }
                content={
                    <div className="p-16 sm:p-24">
                        {value === 0 && (
                            <CurrencyTab />
                        )}
                        {value === 1 && (
                            <EventTypeTab />
                        )}
                        {value === 2 && (
                            <EventStateTab />
                        )}
                    </div>
                }
            />
        )
    };
}

export default withStyles(styles, {withTheme: true})(Basedata);
