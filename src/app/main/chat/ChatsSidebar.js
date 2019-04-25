import {FuseScrollbars, FuseAnimateGroup, FuseUtils} from '@fuse';
import {withStyles, AppBar, Avatar, ListItemIcon, List, ListItem, ListItemText, Menu, MenuItem, Typography, Toolbar, Icon, IconButton, Input, Paper, Button} from '@material-ui/core';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import moment from "moment";
import * as Actions from "./store/actions";
import StatusIcon from "./StatusIcon";
import {SERVER_URL} from 'app/ServerUrl.js';

const statusArr = [
    {
        title: 'Online',
        value: 'online'
    },
    {
        title: 'Away',
        value: 'away'
    },
    {
        title: 'Do not disturb',
        value: 'do-not-disturb'
    },
    {
        title: 'Offline',
        value: 'offline'
    }
];

const styles = theme => ({
    contactListItem: {
        borderBottom: '1px solid ' + theme.palette.divider,
        '&.active'  : {
            backgroundColor: theme.palette.background.paper
        }
    },
    unreadBadge    : {
        backgroundColor: theme.palette.secondary.main,
        color          : theme.palette.secondary.contrastText
    }
});

class ChatsSidebar extends Component {

    state = {
        statusSwitchEl : null,
        chatsMoreMenuEl: null,
        searchText     : ''
    };

    handleContactClick = (contactId) => {
        this.props.getChat(contactId);
    };

    chatsMoreMenuClick = (event) => {
        this.setState({chatsMoreMenuEl: event.currentTarget});
    };

    chatsMoreMenuClose = (event) => {
        this.setState({chatsMoreMenuEl: null});
    };

    statusSwitchClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({statusSwitchEl: event.currentTarget});
    };

    statusSwitchClose = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({statusSwitchEl: null});
    };


    getFilteredArray = (arr, searchText) => {
        if ( searchText.length === 0 )
        {
            return arr;
        }
        return FuseUtils.filterArrayByString(arr, searchText);
    };

    setSearchText = event => {
        this.setState({searchText: event.target.value})
    };

    render()
    {
        const {classes, contacts, user, selectedContactId, selectedEventId, setArchived} = this.props;
        const {statusSwitchEl, searchText} = this.state;


        const contactsArr = this.getFilteredArray([...contacts], searchText);

        const ContactListItem = ({contact}) => {
            return (
                <ListItem
                    button
                    className={classNames(classes.contactListItem, "px-16 py-12 min-h-92", {'active': (selectedContactId === contact.id)})}
                    onClick={() => this.handleContactClick(contact.id)}
                >
                    <div className="relative">

                        <div className="absolute pin-r pin-b -m-4 z-10">
                            <StatusIcon status={contact.status}/>
                        </div>

                        {contact.unread !== undefined && contact.unread !== 0 && (
                                <div className={classNames(classes.unreadBadge, "flex items-center justify-center w-20 h-20 rounded-full text-12 text-center -mb-4 -ml-4 z-999 absolute")}>{contact.unread}</div>
                            )}
                        <Avatar src={SERVER_URL + contact.avatar} alt={contact.name}>
                            {!contact.avatar || contact.avatar === '' ? contact.name[0] : ''}
                        </Avatar>
                    </div>

                    <ListItemText
                        classes={{
                            root     : "min-w-px",
                            secondary: "truncate"
                        }}
                        primary={contact.name}
                        secondary={contact.mood}
                    />

                    {contact && (
                        <div className="flex flex-col justify-center items-end">
                            {contact.lastMessageTime && (
                                <Typography className="whitespace-no-wrap mb-8">
                                    {moment(contact.lastMessageTime).format('ll')}
                                </Typography>
                            )}
                            <IconButton onClick={(ev) => {
                                ev.stopPropagation();
                                console.log(contact);
                                setArchived(selectedEventId, contact.id)
                            }}>
                                <Icon>archive</Icon>
                            </IconButton>
                        </div>
                    )}
                </ListItem>
            )
        };

        return (
            <div className="flex flex-col flex-auto h-full">
                <AppBar
                    className={classes.contentToolbar}
                    position="static"
                    color="default"
                    elevation={1}
                >
                    <Toolbar className="flex justify-between items-center px-16 pr-4">
                        <Typography variant="h6" color="primary" className="m-6">
                            Refine Results
                        </Typography>

                        {user && (
                            <div className="flex">
                                {/* <IconButton className="relative w-40 h-40 p-0" onClick={openUserSidebar}> */}
                                <IconButton className="relative w-40 h-40 p-0">

                                    <Avatar src={SERVER_URL + user.avatar} alt={user.name} className="w-40 h-40">
                                        {(!user.avatar || user.avatar === '') ? user.name[0] : ''}
                                    </Avatar>

                                    <div
                                        className="absolute pin-r pin-b -m-4 z-10 cursor-pointer"
                                        aria-owns={statusSwitchEl ? 'switch-menu' : null}
                                        aria-haspopup="true"
                                        onClick={this.statusSwitchClick}
                                    >
                                        <StatusIcon status={user.status}/>
                                    </div>

                                    <Menu
                                        id="status-switch"
                                        anchorEl={statusSwitchEl}
                                        open={Boolean(statusSwitchEl)}
                                        onClose={this.statusSwitchClose}
                                    >
                                        {statusArr.map((status) => (
                                            <MenuItem onClick={this.statusSwitchClose} key={status.value}>
                                                <ListItemIcon>
                                                    <StatusIcon status={status.value}/>
                                                </ListItemIcon>
                                                <ListItemText primary={status.title}/>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </IconButton>
                                <Typography variant="h6" color="primary" className="m-6">
                                    {user.name}
                                </Typography>
                            </div>
                        )}
                    </Toolbar>
                    <Toolbar className="px-16">
                        <Paper className="flex p-4 items-center w-full px-8 py-4 rounded-8" elevation={1}>

                            <Icon className="mr-8" color="action">search</Icon>

                            <Input
                                placeholder="Search or start new chat"
                                className="flex flex-1"
                                disableUnderline
                                fullWidth
                                value={searchText}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                onChange={this.setSearchText}
                            />
                        </Paper>
                    </Toolbar>
                    <div className="flex justify-center">
                        <Button className="normal-case" color="secondary" onClick={(ev)=>(this.props.getContacts(selectedEventId, 'Inbox'))}>Inbox</Button>
                        <Button className="normal-case" color="secondary" onClick={(ev)=>(this.props.getContacts(selectedEventId, 'Unread'))}>Unread</Button>
                        <Button className="normal-case" color="secondary" onClick={(ev)=>(this.props.getContacts(selectedEventId, 'Archived'))}>Archived</Button>
                        <Button className="normal-case" color="secondary" onClick={(ev)=>(this.props.getContacts(selectedEventId, 'All'))}>All</Button>
                    </div>
                </AppBar>
                <FuseScrollbars className="overflow-y-auto flex-1">
                    <List className="w-full">
                        {contacts.length > 0 && (
                            <React.Fragment>
                                <FuseAnimateGroup
                                    enter={{
                                        animation: "transition.expandIn"
                                    }}
                                    className="flex flex-col flex-no-shrink"
                                >
                                    {contactsArr.length > 0 && (
                                        <Typography
                                            className="font-300 text-20 px-16 py-24"
                                            color="secondary"
                                        >
                                            Contacts
                                        </Typography>
                                    )}

                                    {contactsArr.map(contact => (
                                        <ContactListItem key={contact.id} contact={contact}/>
                                    ))}
                                </FuseAnimateGroup>
                            </React.Fragment>
                        )}
                    </List>
                </FuseScrollbars>
            </div>
        )
    };
}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getChat        : Actions.getChat,
        openUserSidebar: Actions.openUserSidebar,
        getContacts            : Actions.getContacts,
        setArchived            : Actions.setArchived,
    }, dispatch);
}

function mapStateToProps({chatApp})
{
    return {
        contacts         : chatApp.contacts.entities,
        selectedContactId: chatApp.contacts.selectedContactId,
        selectedEventId       : chatApp.events.selectedEventId,
        user             : chatApp.user
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(ChatsSidebar));
