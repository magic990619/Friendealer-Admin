import React, {Component} from 'react';
import {withStyles, Divider, Icon, List, ListItem, ListItemText, Paper} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {NavLink, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const styles = theme => ({
    listItem: {
        color         : 'inherit!important',
        textDecoration: 'none!important',
        height        : 40,
        width         : 'calc(100% - 16px)',
        borderRadius  : '0 20px 20px 0',
        paddingLeft   : 24,
        paddingRight  : 12,
        '&.active'    : {
            backgroundColor    : theme.palette.secondary.main,
            color              : theme.palette.secondary.contrastText + '!important',
            pointerEvents      : 'none',
            '& .list-item-icon': {
                color: 'inherit'
            }
        }
    }
});

class UsersSidebarContent extends Component {

    render()
    {
        const {classes} = this.props;

        return (
            <div className="p-16 lg:p-24 lg:pr-4">
                <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                    <Paper elevation={1} className="rounded-8">
                        <Divider/>
                        <List>
                            <ListItem
                                button
                                component={NavLink}
                                to={'/users/all'}
                                activeClassName="active"
                                className={classes.listItem}
                            >
                                <Icon className="list-item-icon text-16" color="action">people</Icon>
                                <ListItemText className="truncate pr-0" primary="All accounts" disableTypography={true}/>
                            </ListItem>
                            <ListItem
                                button
                                component={NavLink}
                                to={'/users/active'}
                                activeClassName="active"
                                className={classes.listItem}
                            >
                                <Icon className="list-item-icon text-16" color="action">check_circle</Icon>
                                <ListItemText className="truncate pr-0" primary="Active accounts" disableTypography={true}/>
                            </ListItem>
                            <ListItem
                                button
                                component={NavLink}
                                to={'/users/inactive'}
                                activeClassName="active"
                                className={classes.listItem}
                            >
                                <Icon className="list-item-icon text-16" color="action">contact_support</Icon>
                                <ListItemText className="truncate pr-0" primary="Inactive accounts" disableTypography={true}/>
                            </ListItem>
                            <ListItem
                                button
                                component={NavLink}
                                to={'/users/closed'}
                                activeClassName="active"
                                className={classes.listItem}
                            >
                                <Icon className="list-item-icon text-16" color="action">close</Icon>
                                <ListItemText className="truncate pr-0" primary="Closed accounts" disableTypography={true}/>
                            </ListItem>
                            <ListItem
                                button
                                component={NavLink}
                                to={'/users/restricted'}
                                activeClassName="active"
                                className={classes.listItem}
                            >
                                <Icon className="list-item-icon text-16" color="action">access_time</Icon>
                                <ListItemText className="truncate pr-0" primary="Restricted accounts" disableTypography={true}/>
                            </ListItem>
                        </List>
                    </Paper>
                </FuseAnimate>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({usersApp})
{
    return {
        user: usersApp.user
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersSidebarContent)));
