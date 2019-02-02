import React, {Component} from 'react';
import {TextField, Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, Avatar} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import * as Actions from './store/actions';
import {connect} from 'react-redux';
import _ from '@lodash';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import api from 'app/ApiConfig';

const newUserState = {
    _id      : '',
    user_name: '',
    email   : '',
    role: '',
    account_type: '',
    membership: '',
    account_status: '',
    start_time: Date(),
    end_time: Date(),
    avatar  : 'assets/images/avatars/profile.jpg',
    basedata: null,
};

class UserDialog extends Component {

    state = {...newUserState};

    componentDidMount() {
        api.post('/base/getBasedata', {})
        .then(res => {
            this.setState({basedata: res.data.doc});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        /**
         * After Dialog Open
         */
        if ( !prevProps.userDialog.props.open && this.props.userDialog.props.open )
        {
            /**
             * Dialog type: 'edit'
             * Update State
             */
            if ( this.props.userDialog.type === 'edit' &&
                this.props.userDialog.data &&
                !_.isEqual(this.props.userDialog.data, prevState) )
            {
                this.setState({...this.props.userDialog.data});
            }

            /**
             * Dialog type: 'new'
             * Update State
             */
            if ( this.props.userDialog.type === 'new' &&
                !_.isEqual(newUserState, prevState) )
            {
                this.setState({...newUserState});
            }
        }
    }

    handleChange = (event) => {
        this.setState(_.set({...this.state}, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };

    closeComposeDialog = () => {
        this.props.userDialog.type === 'edit' ? this.props.closeEditUserDialog() : this.props.closeNewUserDialog();
    };

    canBeSubmitted()
    {
        const {user_name} = this.state;
        return (
            user_name.length > 0
        );
    }

    render()
    {
        const {userDialog, addUser, updateUser, removeUser} = this.props;
        const {basedata} = this.state;

        return (
            <Dialog
                classes={{
                    paper: "m-24"
                }}
                {...userDialog.props}
                onClose={this.closeComposeDialog}
                fullWidth
                maxWidth="sm"
            >

                <AppBar position="static" elevation={1}>
                    <Toolbar className="flex w-full">
                        <Typography variant="subtitle1" color="inherit">
                            {userDialog.type === 'new' ? 'New User' : 'Edit User'}
                        </Typography>
                    </Toolbar>
                    <div className="flex flex-col items-center justify-center pb-24">
                        <Avatar
                            className="w-96 h-96"
                            alt="user avatar"
                            src={this.state.avatar && this.state.avatar !== '' ? this.state.avatar : "assets/images/avatars/profile.jpg"}
                        />
                        {userDialog.type === 'edit' && (
                            <Typography variant="h6" color="inherit" className="pt-8">
                                {this.state.user_name}
                            </Typography>
                        )}
                    </div>
                </AppBar>

                <DialogContent classes={{root: "p-24"}}>
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">account_circle</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                User Name
                        </Typography>

                        <TextField
                            className="mb-24"
                            label="User Name"
                            autoFocus
                            id="user_name"
                            name="user_name"
                            value={this.state.user_name}
                            onChange={this.handleChange}
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">email</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Email
                        </Typography>
                        <TextField
                            className="mb-24"
                            label="Email"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            variant="outlined"
                            fullWidth
                            required
                        />
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">accessibility</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Role
                        </Typography>
                        <Select
                            className="mb-24"
                            native
                            value={this.state.role}
                            onChange={this.handleChange}
                            input={
                            <OutlinedInput
                                name="role"
                                labelWidth={0}
                                id="role"
                            />
                            }
                            fullWidth
                        >
                            <option value="admin">admin</option>
                            <option value="staff">staff</option>
                            <option value="user">user</option>
                            <option value="guest">guest</option>
                        </Select>
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">accessible</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Account Type
                        </Typography>
                        <Select
                            className="mb-24"
                            native
                            value={this.state.account_type}
                            onChange={this.handleChange}
                            input={
                            <OutlinedInput
                                name="account_type"
                                labelWidth={0}
                                id="account_type"
                            />
                            }
                            fullWidth
                        >
                            <option value="Work">Work</option>
                            <option value="Hire">Hire</option>
                        </Select>
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">tag_faces</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Membership
                        </Typography>
                        <Select
                            className="mb-24"
                            native
                            value={this.state.membership}
                            onChange={this.handleChange}
                            input={
                            <OutlinedInput
                                name="membership"
                                labelWidth={0}
                                id="membership"
                            />
                            }
                            fullWidth
                        >
                            {basedata && 
                                basedata.membership.map((cursor) => (
                                    <option value={cursor.name} key={cursor._id}>{cursor.name}</option>
                                ))
                            }
                        </Select>
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">people_outline</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Account Status
                        </Typography>
                        <Select
                            className="mb-24"
                            native
                            value={this.state.account_status}
                            onChange={this.handleChange}
                            input={
                            <OutlinedInput
                                name="account_status"
                                labelWidth={0}
                                id="account_status"
                            />
                            }
                            fullWidth
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Closed">Closed</option>
                            <option value="Restricted">Restricted</option>
                        </Select>
                    </div>

{this.state.account_status === 'Restricted' &&
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">Start Time</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                Start Time
                        </Typography>
                        <TextField
                            className="mb-24"
                            id="start_time"
                            name="start_time"
                            label="Start Time"
                            type="date"
                            value={this.state.start_time}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
}

{this.state.account_status === 'Restricted' &&
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">End Time</Icon>
                        </div>
                        <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                                End Time
                        </Typography>
                        <TextField
                            className="mb-24"
                            id="end_time"
                            name="end_time"
                            label="End Time"
                            type="date"
                            value={this.state.end_time}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
}

                </DialogContent>

                {userDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                addUser(this.state);
                                this.closeComposeDialog();
                            }}
                            disabled={!this.canBeSubmitted()}
                        >
                            Add
                        </Button>
                    </DialogActions>
                ) : (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                updateUser(this.state);
                                this.closeComposeDialog();
                            }}
                            disabled={!this.canBeSubmitted()}
                        >
                            Save
                        </Button>
                        <IconButton
                            onClick={() => {
                                if (window.confirm('Are you sure to delete it?')) {
                                    removeUser(this.state._id);
                                    this.closeComposeDialog();
                                }
                            }}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                    </DialogActions>
                )}
            </Dialog>
        );
    }
}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        closeEditUserDialog: Actions.closeEditUserDialog,
        closeNewUserDialog : Actions.closeNewUserDialog,
        addUser            : Actions.addUser,
        updateUser         : Actions.updateUser,
        removeUser         : Actions.removeUser
    }, dispatch);
}

function mapStateToProps({usersApp})
{
    return {
        userDialog: usersApp.users.userDialog
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserDialog);
