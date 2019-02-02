import React, {Component} from 'react';
import api from 'app/ApiConfig'
import PropTypes from 'prop-types';
import {withStyles, Button, Typography, Icon, IconButton, Tooltip } from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import _ from '@lodash';
import Widget1 from './Widget1';
import Widget2 from './Widget2';
import Widget3 from './Widget3';
import Widget4 from './Widget4';
import Widget5 from './Widget5';
import Widget6 from './Widget6';
import Widget7 from './Widget7';
import Widget8 from './Widget8';
  
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
        data: [],
    };

    componentDidMount() {
        api.post('/dashboard/getDashboardData', {})
            .then(res => {
                console.log(res.data);
                this.setState({data: res.data.doc});
            });
    }

    render()
    {
        const { classes } = this.props;
        const { data } = this.state;

        console.log(data);

        return (
            <FusePageSimple
                classes={{
                    header : classes.layoutHeader,
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="flex flex-col items-center w-full h-320">
                    {data && data.length !== 0 &&
                        <Widget1 data={data.visit_data}/>
                    }
                    </div>
                }
                content={
                    <div>
                        <FuseAnimate animation="transition.slideUpIn" delay={200}>
                            <div className="flex flex-col md:flex-row sm:p-8 container">
                                <div className="flex flex-1 flex-col min-w-0">
                                    <FuseAnimate delay={600}>
                                        <Typography className="p-16 pb-8 text-18 font-300">
                                            How are your active users trending over time?
                                        </Typography>
                                    </FuseAnimate>

                                    <div className="flex flex-col sm:flex sm:flex-row pb-32">

                                        <div className="widget flex w-full sm:w-1/3 p-16">
                                            <Widget2 data={{value: data.all_account, ofTarget: 100}} />
                                        </div>

                                        <div className="widget flex w-full sm:w-1/3 p-16">
                                            <Widget3 data={{value: data.work_count, ofTarget: parseInt(100 * data.work_count / data.all_account)}} />
                                        </div>

                                        <div className="widget w-full sm:w-1/3 p-16">
                                            <Widget4 data={{value: data.hire_count, ofTarget: parseInt(100 * data.hire_count / data.all_account)}} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex sm:flex-row pb-32">
                                        <Widget5 data={{
                                            free : data.free_membership_account,
                                            basic : data.basic_membership_account,
                                            premium : data.premium_membership_account,
                                            premiumpro : data.premiumpro_membership_account,
                                        }}/>
                                        <Widget6 data={{
                                            total: data.total_events,
                                            progress: data.on_progresss_events,
                                            finished: data.on_finished_events,
                                            closed: data.on_closed_events,
                                            new: data.on_new_events,
                                        }}/>
                                    </div>
                                    <div className="flex flex-col sm:flex sm:flex-row pb-32">
                                        <Widget8 data={data.markers} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap w-full md:w-320 pt-16">
                                    <div className="mb-32 w-full sm:w-1/2 md:w-full">
                                        <FuseAnimate delay={600}>
                                            <Typography className="px-16 pb-8 text-18 font-300">
                                                What are your top devices?
                                            </Typography>
                                        </FuseAnimate>

                                        <div className="widget w-full p-16">
                                            <Widget7 data={{desktop: data.desktop_count, mobile: data.mobile_count}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FuseAnimate>
                    </div>
                }
            />
        );
    };
}

export default withStyles(styles, {withTheme: true})(MembershipPage);
