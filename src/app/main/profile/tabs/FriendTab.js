import React, {Component} from 'react';
import {    Divider,
    CardActions,
    Avatar, AppBar, Button, Card, CardContent, Icon, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Toolbar, Typography, Input} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import api from 'app/ApiConfig';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import history from 'history.js';
import _ from '@lodash';

const newProfile = {
    profileData: {
        user_id: '',
        friend_groups: [{
            name: '',
            image: '',
            count: 0,
        }],
        friends: [ {
            friend_id: '',
            name: '',
            avatar: '',
            is_favourite: '',
            created_at: '',
        }],
    },
    edit_group: {
        name: '',
        image: '',
        count: 0,
    },
    select_group: 0,
    is_add: false,
    open: false,
};
class FriendTab extends Component {

    state = {...newProfile};

    componentDidMount()
    {
        this.getUserProfile();
    }

    getUserProfile = () => {
        const {user_id} = this.props;

        api.post('/profile/getUserProfileById', {
            user_id
        }).then(res => { res.data.doc &&
            this.setState({ profileData: res.data.doc });
        });
    }

    handleChange = name => event => {
        var cursor = this.state.profileData;
        cursor[name] = event.target.value;
        this.setState({
            profileData: cursor,
        });
    };

    handleSave = () => {
        var profile = this.state.profileData;
        profile.user_id = this.props.user_id;
        api.post('/profile/saveUserProfileById', {
            profile
        });
    }

    handleDeleteFriend = friend_id => {
        var profile = this.state.profileData;
        var friends = this.state.profileData.friends;
        var res = [];
        friends.forEach(function(cursor, err) {
            if (cursor.friend_id !== friend_id) {
                res.push(cursor);
            }
        });
        profile.friends = res;
        this.setState({ profileData: profile });
        this.handleSave();
    }

    handleClickOpen = (group, is_add) => {
        this.setState({ open: true, edit_group: group, is_add: is_add, select_group: group._id});
    };

    handleSaveGroup = () => {
        var profile = this.state.profileData;
        const {edit_group} = this.state;
        var {friend_groups} = profile;
        var res = [];
        friend_groups.forEach(function(cursor, err) {
            if (cursor._id === edit_group._id)
                res.push(edit_group);
            else res.push(cursor);
        })
        profile.friend_groups = res;
        this.setState({profileData: profile, open: false});
        this.handleSave();
    }

    handleAddGroup = () => {
        var profile = this.state.profileData;
        const {edit_group} = this.state;
        profile.friend_groups.push(edit_group);
        this.setState({profileData: profile, open: false});
        this.handleSave();
    }

    handleRemoveGroup = (group) => {
        var profile = this.state.profileData;
        var {friend_groups} = profile;
        var res = [];
        friend_groups.forEach(function(cursor, err) {
            if (cursor._id !== group._id)
                res.push(cursor);
        })
        profile.friend_groups = res;
        this.setState({profileData: profile, open: false});
        this.handleSave();
    }

    handleClose = () => {
        this.setState({open: false});
    };

    handleselectedFile = e => {
        let file = e.target.files[0];
        const formData = new FormData();
        var edit = this.state.edit_group;
        formData.append('file',file)
        console.log(file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return api.post("/upload", formData, config)
            .then(res => {
                console.log(res.data.file);
                edit['image'] = res.data.file.filename;
                this.setState({
                edit_group: edit,
            })});
    }

    handleEditName = event => {
        this.setState({edit_group: _.set({...this.state.edit_group}, 'name', event.target.value)});
    }

    handleSelect = (select_group) => {
        console.log(select_group);
        this.setState({select_group: select_group});
    }

    render()
    {
        const {edit_group, select_group} = this.state;
        // console.log(this.state.profileData);
        var friends = this.state.profileData.user_id === '' ? null : this.state.profileData.friends;
        var friend_groups = this.state.profileData.user_id === '' ? null : this.state.profileData.friend_groups;

        console.log(friends);

        return (
            <div className="md:flex max-w-full">
                <div className="max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
                    <Button className="mr-8 normal-case" variant="contained" color="secondary"
                        onClick={(ev) => {
                            ev.stopPropagation();
                            this.handleClickOpen({
                                name: '',
                                image: '',
                                count: 0,
                            }, true);
                        }}
                    > Add </Button>
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                        className="flex flex-wrap py-24"
                    >
                        { (friend_groups == null || friend_groups.length === 0) && (
                            <div className="flex flex-1 items-center justify-center">
                                <Typography color="textSecondary" className="text-24 my-24">
                                    No friend group found!
                                </Typography>
                            </div>
                        )}

                        {friend_groups && friend_groups.map((group) => {
                            return (
                                <div className="w-full pb-12 sm:w-1/3 lg:w-1/4 sm:p-16" key={group._id}>
                                    <Card elevation={1} className="flex flex-col h-200" onClick={(ev) => {
                                        this.handleSelect(group._id);
                                    }}>
                                        <div
                                            className="flex flex-no-shrink items-center justify-between px-24 h-48"
                                        >
                                            <Typography className="font-medium truncate" color="inherit">[{group.count}] friendealers</Typography>
                                            <div className="flex items-center justify-center opacity-75">
                                                <IconButton onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    if (window.confirm('Are you sure to delete this group?'))
                                                        this.handleRemoveGroup(group);
                                                }}>
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </div>
                                        </div>
                                        <CardContent className="flex flex-col flex-auto items-center justify-center">
                                            <img className="w-64" src={'http://localhost:8888/uploads/' + group.image} alt="image"/>
                                            <Typography className="text-center text-16 font-800">{group.name}</Typography>
                                        </CardContent>
                                        <Divider/>
                                        <CardActions className="justify-center">
                                            <Button
                                                className="justify-center px-10"
                                                color="secondary"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    this.handleClickOpen(group, false);
                                                }}
                                            > Edit </Button>
                                            <Dialog
                                                open={this.state.open}
                                                onClose={this.handleClose}
                                                aria-labelledby="form-dialog-title"
                                                >
                                                <div>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                        Please enter group details here.
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            className="m-4"
                                                            id="name"
                                                            name="name"
                                                            label="Name"
                                                            value={edit_group.name}
                                                            onChange={this.handleEditName}
                                                            fullWidth
                                                        />
                                                        Image: <input type='file' id='image' name='image' onChange={this.handleselectedFile} />
                                                    </DialogContent>
                                                    <DialogActions>
                                                    {this.state.is_add === false &&
                                                        <Button onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            this.handleSaveGroup();
                                                        }} color="primary">
                                                            Save
                                                        </Button>
                                                        }
                                                        {this.state.is_add === true &&
                                                        <Button onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            this.handleAddGroup();
                                                        }} color="primary">
                                                            Add
                                                        </Button>
                                                        }
                                                        <Button onClick={this.handleClose} color="primary">
                                                            Cancel
                                                        </Button>
                                                    </DialogActions>
                                                </div>
                                            </Dialog>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })}
                    </FuseAnimateGroup>
                </div>
                <div className="flex flex-col md:w-400">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <Card className="w-full mb-16 mr-24">
                            <AppBar position="static" elevation={0}>
                                <Toolbar className="pl-16 pr-8">
                                    <Typography variant="subtitle1" color="inherit" className="flex-1">
                                        Friends
                                    </Typography>
                                    {/* <Button className="normal-case" color="inherit" size="small">See 454 more</Button> */}
                                </Toolbar>
                            </AppBar>
                            <CardContent className="p-0">
                                <List className="p-8">
                                    {friends && friends.map((friend) => (friend.is_favourite === select_group &&
                                        // <img key={friend.friend_id} className="w-64 m-4" src={friend.avatar} alt={friend.name} />
                                        <ListItem key={friend.friend_id}>
                                        {friend.friend_id !== '' &&
                                            <Avatar src={friend.avatar} alt={friends.name}>{friends.name}</Avatar>
                                        }
                                            <ListItemText
                                                primary={(
                                                    <div className="">
                                                        <Typography className="inline font-medium" color="primary" paragraph={false}>
                                                            {friend.name}
                                                        </Typography>

                                                        {/* <Typography className="inline ml-4" color="primary" paragraph={false}>
                                                            {(friend.is_favourite == 0 ? "" : "favourite")}
                                                        </Typography> */}
                                                    </div>
                                                )}
                                                secondary={friend.is_favourite === true ? "favourite" : ""}
                                            />
                                            <ListItemSecondaryAction>
                                                    <IconButton>
                                                        <Icon onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            history.push('/profile/' + friend.friend_id);
                                                            window.location.reload();
                                                            }}>more_vert</Icon>
                                                    </IconButton>
                                                    <IconButton>
                                                        <Icon onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            if (window.confirm('Are you sure to remove this friend?'))
                                                                this.handleDeleteFriend(friend.friend_id);
                                                            }}>delete</Icon>
                                                    </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                    {/* {
                                        friends == null &&
                                        <Typography className="inline font-medium" color="primary" paragraph={false}>
                                            There are no friends.
                                       </Typography>
                                    } */}
                                </List>
                            </CardContent>
                        </Card>
                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default FriendTab;
