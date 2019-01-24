import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from 'app/ApiConfig';
import {
    Icon, IconButton,
} from '@material-ui/core';

export default class PhotoEditDialog extends React.Component {
  state = {
    open: false,
    prev_url: '',
    photo_url: '',
    comment: '',
  };

  componentDidMount()
  {
      this.setState( { 
          prev_url: this.props.photo_url,
          photo_url: this.props.photo_url,
          comment: this.props.comment,
      });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleComment = event => {
      this.setState({comment: event.target.value});
  }

  handleselectedFile = e => {
    let file = e.target.files[0];
    const formData = new FormData();
    const prev_url = this.state.photo_url;
    formData.append('file',file)
    console.log(file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return api.post("/upload", formData, config)
        .then(res => this.setState({
            photo_url: res.data.file.path,
            prev_url: prev_url
        }));
  }

  handleSave = () => {
    this.handleClose();
    this.props.onSave(this.state.prev_url, this.state.photo_url, this.state.comment);
  }

  render() {
    return (
      <div>
        <IconButton >
            <Icon onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
            }}>info</Icon>
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Photo</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this photo, please enter upload here.
            </DialogContentText>
            <input type='file' id='photo_url' name='photo_url' onChange={this.handleselectedFile} />
              <TextField
              autoFocus
              margin="dense"
              id="comment"
              name="comment"
              label="Comment"
              value={this.state.comment}
              onChange={this.handleComment}
              variant="outlined"
              multiline
              rows={7}
              fullWidth
             />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color="primary">
                Save
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