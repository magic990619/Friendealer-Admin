import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from 'app/ApiConfig';

class PhotoAddDialog extends React.Component {
  state = {
    open: false,
    photo_url: '',
    title: '',
    description: '',
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

  handleTitle = event => {
    this.setState({title: event.target.value});
  }

  handleDescription = event => {
    this.setState({description: event.target.value});
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
            photo_url: "http://localhost:8888/uploads/" + res.data.file.filename,
            prev_url: prev_url
        }));
  }

  handleSave = () => {
    this.handleClose();
    this.props.onSave({
      event_id: this.props.event_id,
      photo_url: this.state.photo_url,
      title: this.state.title,
      description: this.state.description,
    });
  }

  render() {
    return (
      <div>
        <div className="flex items-center justify-end">
          <Button className="normal-case" variant="contained" color="primary" aria-label="Send Message" onClick={(ev) => {
            ev.stopPropagation();
            this.handleClickOpen();
          }}>Select Images</Button>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Photo</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add photo, please enter upload here.
            </DialogContentText>
            <input type='file' id='photo_url' name='photo_url' onChange={this.handleselectedFile} />
              <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              value={this.state.title}
              onChange={this.handleTitle}
              variant="outlined"
              fullWidth
             />
              <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              value={this.state.description}
              onChange={this.handleDescription}
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

export default  PhotoAddDialog;