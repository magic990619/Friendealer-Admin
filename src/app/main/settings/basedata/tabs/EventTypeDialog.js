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

export default class EventTypeDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
        _id: '',
        name: '',
        days: [],
        budget: [],
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

  handleDayChange = (index, ev) => {
    var {row} = this.state;
    row.days[index] = ev.target.value;
    this.setState({row});
  }

  handleBudgetChange = (index, ev) => {
    var {row} = this.state;
    row.budget[index] = ev.target.value;
    this.setState({row});
  }

  render() {
    const {onSave, onRemove} = this.props;
    const {row} = this.state;
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
              value={row.name}
              onChange={this.handleChange('name')}
              variant="outlined"
            />
            {row.days && row.days.map((cursor, index)=>(
              <div className="flex">
                <TextField
                  margin="dense"
                  type="number"
                  value={cursor}
                  onChange={ev => this.handleDayChange(index, ev)}
                  variant="outlined"
                />
                <span className="text-20 font-bold w-full mt-12">days : </span>
                <TextField
                  margin="dense"
                  type="number"
                  value={row.budget[index]}
                  onChange={ev => this.handleBudgetChange(index, ev)}
                  variant="outlined"
                />
                <span className="text-20 font-bold w-full mt-12">USD</span>
              </div>
            ))

            }
          </DialogContent>
          <DialogActions>
            <Button onClick={ev=>{
              ev.stopPropagation();
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