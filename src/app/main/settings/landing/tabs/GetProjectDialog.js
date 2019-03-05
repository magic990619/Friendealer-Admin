import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Icon, IconButton, Typography,
} from '@material-ui/core';
import api from 'app/ApiConfig';

export default class GetProjectDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
        _id: '',
        name: '',
        cost: 0,
        description: '',
        url: '',
    }
  };

  componentDidMount()
  {
    this.setState( { row: this.props.row, type: this.props.type } );
  }

  handleClickOpen = () => {
    this.setState({ open: true, row: this.props.row, type: this.props.type });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
      var cursor = this.state.row;
      cursor[name] = event.target.value;
      this.setState({row: cursor});
  }

  handleselectedFile = e => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return api.post("/upload", formData, config)
        .then(res => {
          var cursor = this.state.row;
          cursor.url = "http://localhost:8888/uploads/" + res.data.file.filename;
          this.setState({row: cursor});
        });
  }

  render() {
    const {onSave, onRemove} = this.props;
    return (
      <div>
        {this.state.type === 'edit' &&
          <div>
            <IconButton onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
            }}>
                <Icon>edit_attributes</Icon>
            </IconButton>
            <IconButton onClick={(ev) => {
                ev.stopPropagation();
                if (window.confirm('Are you sure to remove this event type?')) {
                    onRemove(this.state.row);
                }
            }}>
                <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        }
        {this.state.type === 'add' &&
            <div className="flex items-center justify-end">
                <Button className="normal-case" variant="contained" color="primary" aria-label="Add Event Type" onClick={(ev) => {
                    ev.stopPropagation();
                    this.handleClickOpen();
                }}>Add Event Type</Button>
            </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Event Type</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit to this event type, please enter name here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Event Type"
              value={this.state.row.name}
              onChange={this.handleChange('name')}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="cost"
              name="cost"
              label="Cost"
              value={this.state.row.cost}
              onChange={this.handleChange('cost')}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              value={this.state.row.description}
              onChange={this.handleChange('description')}
              variant="outlined"
              fullWidth
            />
            <div className="flex">
              <Typography variant="subtitle1">Image: </Typography>
              <input className="m-4" type='file' id='photo_url' name='photo_url' onChange={this.handleselectedFile} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={ev=>{
                this.handleClose();
                onSave(this.state.row, this.state.type);}
            } color="secondary">
                {this.state.type === 'edit' && 'Save'}
                {this.state.type === 'add' && 'Add'}
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