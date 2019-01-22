import React, {Component} from 'react';
import {TextField, Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, Avatar} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import * as Actions from './store/actions';
import {connect} from 'react-redux';
import _ from '@lodash';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const newContactState = {
    _id      : '',
    user_name: '',
    email   : '',
    role: '',
    account_type: '',
    membership: '',
    account_status: '',
    start_time: Date(),
    end_time: Date(),
    avatar  : '',
};

class ContactDialog extends Component {

    state = {...newContactState};

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        /**
         * After Dialog Open
         */
        if ( !prevProps.contactDialog.props.open && this.props.contactDialog.props.open )
        {
            /**
             * Dialog type: 'edit'
             * Update State
             */
            if ( this.props.contactDialog.type === 'edit' &&
                this.props.contactDialog.data &&
                !_.isEqual(this.props.contactDialog.data, prevState) )
            {
                this.setState({...this.props.contactDialog.data});
            }

            /**
             * Dialog type: 'new'
             * Update State
             */
            if ( this.props.contactDialog.type === 'new' &&
                !_.isEqual(newContactState, prevState) )
            {
                this.setState({...newContactState});
            }
        }
    }

    handleChange = (event) => {
        this.setState(_.set({...this.state}, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };

    closeComposeDialog = () => {
        this.props.contactDialog.type === 'edit' ? this.props.closeEditContactDialog() : this.props.closeNewContactDialog();
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
        const {contactDialog, addContact, updateContact, removeContact} = this.props;

        return (
            <Dialog
                classes={{
                    paper: "m-24"
                }}
                {...contactDialog.props}
                onClose={this.closeComposeDialog}
                fullWidth
                maxWidth="xs"
            >

                <AppBar position="static" elevation={1}>
                    <Toolbar className="flex w-full">
                        <Typography variant="subtitle1" color="inherit">
                            {contactDialog.type === 'new' ? 'New Contact' : 'Edit Contact'}
                        </Typography>
                    </Toolbar>
                    <div className="flex flex-col items-center justify-center pb-24">
                        <Avatar className="w-96 h-96" alt="contact avatar" src={this.state.avatar}/>
                        {contactDialog.type === 'edit' && (
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
                        <TextField
                            className="mb-24"
                            label="Email"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            variant="outlined"
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">accessibility</Icon>
                        </div>
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
                            <option value="" />
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
                            <option value="Free">Free</option>
                            <option value="Basic">Basic</option>
                            <option value="Premium">Premium</option>
                            <option value="Premium Pro">Premium Pro</option>
                        </Select>
                    </div>

                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">people_outline</Icon>
                        </div>
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
                            <option value="" />
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Closed">Closed</option>
                            <option value="Restricted">Restricted</option>
                        </Select>
                    </div>

{this.state.account_status == 'Restricted' &&
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">Start Time</Icon>
                        </div>
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

{this.state.account_status == 'Restricted' &&
                    <div className="flex">
                        <div className="min-w-48 pt-20">
                            <Icon color="action">End Time</Icon>
                        </div>
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

                {contactDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                addContact(this.state);
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
                                updateContact(this.state);
                                this.closeComposeDialog();
                            }}
                            disabled={!this.canBeSubmitted()}
                        >
                            Save
                        </Button>
                        <IconButton
                            onClick={() => {
                                removeContact(this.state._id);
                                this.closeComposeDialog();
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
        closeEditContactDialog: Actions.closeEditContactDialog,
        closeNewContactDialog : Actions.closeNewContactDialog,
        addContact            : Actions.addContact,
        updateContact         : Actions.updateContact,
        removeContact         : Actions.removeContact
    }, dispatch);
}

function mapStateToProps({contactsApp})
{
    return {
        contactDialog: contactsApp.contacts.contactDialog
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ContactDialog);
