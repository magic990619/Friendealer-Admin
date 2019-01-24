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
    Icon, IconButton, withStyles, Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import {fade} from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root    : {
      background: theme.palette.primary.main,
      color     : theme.palette.getContrastText(theme.palette.primary.main)
  },
  board   : {
      cursor                  : 'pointer',
      boxShadow               : theme.shadows[0],
      transitionProperty      : 'box-shadow border-color',
      transitionDuration      : theme.transitions.duration.short,
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      background              : theme.palette.primary.light,
      color                   : theme.palette.getContrastText(theme.palette.primary.light),
      '&:hover'               : {
          boxShadow: theme.shadows[6]
      }
  },
  newBoard: {
      borderWidth: 3,
      borderStyle: 'dashed',
      borderColor: fade(theme.palette.getContrastText(theme.palette.primary.main), 0.6),
      '&:hover'  : {
          borderColor: fade(theme.palette.getContrastText(theme.palette.primary.main), 0.8)
      }
  }
});

class PhotoAddDialog extends React.Component {
  state = {
    open: false,
    photo_url: '',
    comment: '',
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
    this.props.onSave(this.state.photo_url, this.state.comment);
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <div
          className={classNames(classes.board, classes.newBoard, "flex flex-col items-center justify-center w-full h-full rounded py-24")}
          onClick={(ev) => {
            ev.stopPropagation();
            this.handleClickOpen();
        }}>
          <Icon className="text-56">add_circle</Icon>
          <Typography className="text-16 font-300 text-center pt-16 px-32" color="inherit">Add new photo</Typography>
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

export default  withStyles(styles, {withTheme: true})(PhotoAddDialog);