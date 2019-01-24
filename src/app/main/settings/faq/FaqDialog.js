import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Icon, IconButton,
} from '@material-ui/core';

export default class FaqDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
        _id: '',
        title: '',
        subtitle: '',
        description: '',
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
                if (window.confirm('Are you sure to remove this faq?')) {
                    onRemove(this.state.row);
                }
            }}>
                <Icon type="small">delete</Icon>
            </IconButton>
          </div>
        }
        {this.state.type === 'add' &&
            <div className="flex items-center justify-end">
                <Button className="normal-case" variant="contained" color="primary" aria-label="Add Message" onClick={(ev) => {
                    ev.stopPropagation();
                    this.handleClickOpen();
                }}>Add Message</Button>
            </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit to this FAQ, please enter description here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              value={this.state.row.title}
              onChange={this.handleChange('title')}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="subtitle"
              name="subtitle"
              label="Subtitle"
              value={this.state.row.subtitle}
              onChange={this.handleChange('subtitle')}
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
              multiline
              rows={7}
              fullWidth
            />
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