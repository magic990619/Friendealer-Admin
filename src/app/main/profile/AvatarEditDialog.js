import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from 'app/ApiConfig';
import {
    Icon, IconButton,
} from '@material-ui/core';

export default class AvatarEditDialog extends React.Component {
  state = {
    open: false,
    photo_url: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

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
            photo_url: "http://localhost:8888/uploads/" + res.data.file.filename,
            prev_url: prev_url
        }));
  }

  handleSave = () => {
    this.handleClose();
    this.props.onSave(this.state.photo_url);
  }

  render() {
    const {type} = this.props;
    return (
      <div>
        {type === 'avatar' &&
        <IconButton >
            <Icon onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
            }}>info</Icon>
        </IconButton>
        }
        {type === 'background' &&
        <Button className="mr-8 normal-case" variant="contained" color="secondary" aria-label="Follow" onClick={(ev) => {
          ev.stopPropagation();
          this.handleClickOpen();
          }}>Background</Button>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
        {type === 'avatar' && <DialogTitle id="form-dialog-title">Avatar</DialogTitle>}          
        {type === 'background' && <DialogTitle id="form-dialog-title">Background</DialogTitle>}
          <DialogContent>
            <DialogContentText>
              To edit this image, please enter upload here.
            </DialogContentText>
            <input type='file' id='photo_url' name='photo_url' onChange={this.handleselectedFile} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color="secondary">
                Save
            </Button>
            <Button onClick={this.handleClose} color="secondary">
                Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}