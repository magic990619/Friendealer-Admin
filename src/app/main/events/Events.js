import React, {Component} from 'react';
import {withStyles, Fab, Icon, Typography} from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';

class Events extends Component {

    componentDidMount()
    {
    }

    componentDidUpdate(prevProps, prevState)
    {
    }

    render()
    {
        return (
            <Typography>ASDF</Typography>
        );
    }
}

export default Events;
