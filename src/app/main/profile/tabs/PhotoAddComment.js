import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Icon, IconButton,} from '@material-ui/core';

class PhotoAddComment extends React.Component {
  state = {
    open: false,
    email: '',
    message: '',
  };

  componentDidMount()
  {
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEmail = event => {
    this.setState({email: event.target.value});
  }

  handleMessage = event => {
    this.setState({message: event.target.value});
  }

  handleSave = () => {
    this.handleClose();
    const {photo} = this.props;
    const {email, message} = this.state;
    this.props.onAddComment(photo, {email, message});
  }

  render() {
    return (
      <div>
        <div className="flex min-w-32">
            <IconButton>
                <Icon className="text-white opacity-75" onClick={(ev) => {
                    ev.stopPropagation();
                    this.handleClickOpen();
                }}>comment</Icon>
            </IconButton>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add comment, please enter message here.
            </DialogContentText>
              <TextField
              autoFocus
              margin="dense"
              id="email"
              name="email"
              label="Email"
              value={this.state.email}
              onChange={this.handleEmail}
              variant="outlined"
              fullWidth
             />
              <TextField
              margin="dense"
              id="message"
              name="message"
              label="Message"
              value={this.state.message}
              onChange={this.handleMessage}
              variant="outlined"
              multiline
              rows="7"
              fullWidth
             />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color="primary">
                Add
            </Button>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default PhotoAddComment;