import React from 'react';
import {withStyles, Drawer, AppBar, Toolbar, Typography, IconButton, Hidden, Avatar, Icon, Paper, Button, Input, TablePagination} from '@material-ui/core';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {FuseUtils, FuseScrollbars} from '@fuse';
import classNames from 'classnames';
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import withReducer from 'app/store/withReducer';
import * as Actions from "./store/actions";
import Chat from "./Chat";
import ChatsSidebar from "./ChatsSidebar";
import UserSidebar from './UserSidebar';
import reducer from './store/reducers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import socket from "app/SocketConfig.js";

const drawerWidth = 400;
const headerHeight = 200;

const styles = theme => ({
    root              : {
        display        : 'flex',
        flexDirection  : 'row',
        minHeight      : '100%',
        position       : 'relative',
        flex           : '1 1 auto',
        height         : 'auto',
        backgroundColor: theme.palette.background.default
    },
    list: {
        width: '100%',
        maxWidth: 360,
        background: `linear-gradient(to bottom, ${fade(theme.palette.background.paper, 0.8)} 0,${fade(theme.palette.background.paper, 0.6)} 20%,${fade(theme.palette.background.paper, 0.8)})`,
    },
    topBg             : {
        position       : 'absolute',
        left           : 0,
        right          : 0,
        top            : 0,
        height         : headerHeight,
        backgroundImage: 'url("../../assets/images/backgrounds/header-bg.png")',
        backgroundColor: theme.palette.primary.dark,
        backgroundSize : 'cover',
        pointerEvents  : 'none'
    },
    contentCardWrapper: {
        position                      : 'relative',
        padding                       : 24,
        maxWidth                      : 1400,
        display                       : 'flex',
        flexDirection                 : 'column',
        flex                          : '1 0 auto',
        width                         : '100%',
        minWidth                      : '0',
        maxHeight                     : '100%',
        margin                        : '0 auto',
        [theme.breakpoints.down('sm')]: {
            padding: 16
        },
        [theme.breakpoints.down('xs')]: {
            padding: 12
        }
    },
    contentCard       : {
        display        : 'flex',
        position       : 'relative',
        flex           : '1 1 100%',
        flexDirection  : 'row',
        backgroundImage: 'url("/assets/images/patterns/rain-grey.png")',
        backgroundColor: theme.palette.background.paper,
        boxShadow      : theme.shadows[1],
        borderRadius   : 8,
        minHeight      : 0,
        overflow       : 'hidden'
    },
    drawerPaper       : {
        width                       : drawerWidth,
        maxWidth                    : '100%',
        overflow                    : 'hidden',
        height                      : '100%',
        [theme.breakpoints.up('md')]: {
            position: 'relative'
        }
    },
    contentWrapper    : {
        display      : 'flex',
        flexDirection: 'column',
        flex         : '1 1 100%',
        zIndex       : 10,
        background   : `linear-gradient(to bottom, ${fade(theme.palette.background.paper, 0.8)} 0,${fade(theme.palette.background.paper, 0.6)} 20%,${fade(theme.palette.background.paper, 0.8)})`
    },
    content           : {
        display  : 'flex',
        flex     : '1 1 100%',
        minHeight: 0
    }
});

class ChatApp extends React.Component {

    state = {
        searchText: '',
        page       : 0,
        rowsPerPage: 10,
    };

    componentDidMount()
    {
        this.props.getEvents();
    }

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

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };


    render()
    {
        const {searchText, page, rowsPerPage} = this.state;
        const {classes, chat, getContacts, getUserData, selectedContactId, contacts, events, mobileChatsSidebarOpen, openMobileChatsSidebar, closeMobileChatsSidebar, userSidebarOpen, closeUserSidebar, openContactSidebar} = this.props;
        const selectedContact = contacts.find(_contact => (_contact.id === selectedContactId));

        const eventArray = this.getFilteredArray(events, searchText);

        socket.on("receive:message", data => {
            console.log(data);
            this.props.getUserData(data.event_id);
            this.props.getContacts(data.event_id);
            this.props.getChat(data.contactId);
        });

        return (
            <div className={classNames(classes.root)}>

                <div className={classes.topBg}/>

                <div className={classNames(classes.contentCardWrapper, 'container')}>

                    <div className={classes.contentCard}>
                        <div className={classes.list}>
                            <AppBar
                                className={classes.contentToolbar}
                                position="static"
                                color="default"
                                elevation={1}
                            >
                                <Typography variant="h6" className="my-16 text-center">Events</Typography>
                                <Toolbar className="px-16">
                                    <Paper className="flex p-4 items-center w-full px-8 py-4 rounded-8" elevation={1}>

                                        <Icon className="mr-8" color="action">search</Icon>

                                        <Input
                                            placeholder="Search event"
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
                            </AppBar>
                            <FuseScrollbars className="flex-grow overflow-x-auto">

                            <List component="nav">
                            {eventArray && eventArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
                                <ListItem button onClick={(ev) => {
                                    getUserData(event._id);
                                    getContacts(event._id);
                                }} key={event._id}>
                                    <ListItemText primary={event.name} />
                                </ListItem>
                            ))}
                            {!eventArray &&
                                <Typography variant="subtitle1" className="my-24 text-center">No Events</Typography>
                            }
                            </List>
                            </FuseScrollbars>

                            <TablePagination
                                component="div"
                                count={eventArray && eventArray.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                backIconButtonProps={{
                                    'aria-label': 'Previous Page'
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'Next Page'
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                        <Hidden mdUp>
                            <Drawer
                                className="h-full absolute z-20"
                                variant="temporary"
                                anchor="left"
                                open={mobileChatsSidebarOpen}
                                onClose={closeMobileChatsSidebar}
                                classes={{
                                    paper: classNames(classes.drawerPaper, "absolute pin-l")
                                }}
                                ModalProps={{
                                    keepMounted  : true,
                                    disablePortal: true,
                                    BackdropProps: {
                                        classes: {
                                            root: "absolute"
                                        }
                                    }
                                }}
                            >
                                <ChatsSidebar/>
                            </Drawer>
                        </Hidden>
                        <Hidden smDown>
                            <Drawer
                                className="h-full z-20"
                                variant="permanent"
                                open
                                classes={{
                                    paper: classes.drawerPaper
                                }}
                            >
                                <ChatsSidebar/>
                            </Drawer>
                        </Hidden>
                        <Drawer
                            className="h-full absolute z-30"
                            variant="temporary"
                            anchor="left"
                            open={userSidebarOpen}
                            onClose={closeUserSidebar}
                            classes={{
                                paper: classNames(classes.drawerPaper, "absolute pin-l")
                            }}
                            ModalProps={{
                                keepMounted  : true,
                                disablePortal: true,
                                BackdropProps: {
                                    classes: {
                                        root: "absolute"
                                    }
                                }
                            }}
                        >
                            <UserSidebar/>
                        </Drawer>

                        <main className={classNames(classes.contentWrapper, "z-10")}>
                            {!chat ?
                                (
                                    <div className="flex flex-col flex-1 items-center justify-center p-24">
                                        <Paper className="rounded-full p-48">
                                            <Icon className="block text-64" color="secondary">chat</Icon>
                                        </Paper>
                                        <Typography variant="h6" className="my-24">Chat App</Typography>
                                        <Typography className="hidden md:flex px-16 pb-24 mt-24 text-center" color="textSecondary">
                                            Select a contact to start a conversation!..
                                        </Typography>
                                        <Button variant="outlined" color="primary" className="flex md:hidden normal-case" onClick={openMobileChatsSidebar}>
                                            Select a contact to start a conversation!..
                                        </Button>
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <AppBar className="w-full" position="static" elevation={1}>
                                            <Toolbar className="px-16">
                                                <IconButton
                                                    color="inherit"
                                                    aria-label="Open drawer"
                                                    onClick={openMobileChatsSidebar}
                                                    className="flex md:hidden"
                                                >
                                                    <Icon>chat</Icon>
                                                </IconButton>
                                                {selectedContact &&
                                                <div className="flex items-center cursor-pointer" onClick={openContactSidebar}>
                                                    <div className="relative ml-8 mr-12">
                                                        <div className="absolute pin-r pin-b -m-4 z-10">
                                                            {/* <StatusIcon status={selectedContact.status}/> */}
                                                        </div>

                                                        <Avatar src={selectedContact.avatar} alt={selectedContact.name}>
                                                            {!selectedContact.avatar || selectedContact.avatar === '' ? selectedContact.name[0] : ''}
                                                        </Avatar>
                                                    </div>
                                                    <Typography color="inherit" className="text-18 font-600">{selectedContact.name}</Typography>
                                                </div>
                                                }
                                            </Toolbar>
                                        </AppBar>

                                        <div className={classes.content}>
                                            <Chat className="flex flex-1 z-10"/>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </main>

                        {/* <Drawer
                            className="h-full absolute z-30"
                            variant="temporary"
                            anchor="right"
                            open={contactSidebarOpen}
                            onClose={closeContactSidebar}
                            classes={{
                                paper: classNames(classes.drawerPaper, "absolute pin-r")
                            }}
                            ModalProps={{
                                keepMounted  : true,
                                disablePortal: true,
                                BackdropProps: {
                                    classes: {
                                        root: "absolute"
                                    }
                                }
                            }}
                        >
                            <ContactSidebar/>
                        </Drawer> */}
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getChat                : Actions.getChat,
        getEvents              : Actions.getEvents,
        getUserData            : Actions.getUserData,
        getContacts            : Actions.getContacts,
        setselectedEventId     : Actions.setselectedEventId,
        setselectedContactId   : Actions.setselectedContactId,
        openMobileChatsSidebar : Actions.openMobileChatsSidebar,
        closeMobileChatsSidebar: Actions.closeMobileChatsSidebar,
        openUserSidebar        : Actions.openUserSidebar,
        closeUserSidebar       : Actions.closeUserSidebar,
        openContactSidebar     : Actions.openContactSidebar,
        closeContactSidebar    : Actions.closeContactSidebar
    }, dispatch);
}

function mapStateToProps({chatApp})
{
    return {
        events                : chatApp.events.entities,
        selectedEventId     : chatApp.contacts.selectedEventId,
        chat                  : chatApp.chat,
        contacts              : chatApp.contacts.entities,
        selectedContactId     : chatApp.contacts.selectedContactId,
        mobileChatsSidebarOpen: chatApp.sidebars.mobileChatsSidebarOpen,
        userSidebarOpen       : chatApp.sidebars.userSidebarOpen,
        contactSidebarOpen    : chatApp.sidebars.contactSidebarOpen
    }
}

export default withReducer('chatApp', reducer)(withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(ChatApp)));
