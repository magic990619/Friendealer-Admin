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

export default class MembershipDialog extends React.Component {
  state = {
    open: false,
    type: '',
    row: {
        name: '',
        yearly_rate: 0,
        monthly_rate: 0,
        photos_per_acts: 0,
        free_list_cnt: 0,
        insertion_list_fee: 0,
        fee_paid_acts: 0,
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
          <div className="flex">
            <IconButton onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
            }}>
                <Icon>edit_attributes</Icon>
            </IconButton>
            <IconButton onClick={(ev) => {
                ev.stopPropagation();
                if (window.confirm('Are you sure to remove this membership?')) {
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
                }}>Add Memberhsip</Button>
            </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Membership</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit to this membership, please enter description here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Title"
              value={this.state.row.name}
              onChange={this.handleChange('name')}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="yearly_rate"
              name="yearly_rate"
              label="Annual Rate (USD)"
              value={this.state.row.yearly_rate}
              onChange={this.handleChange('yearly_rate')}
              type="number"
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="monthly_rate"
              name="monthly_rate"
              label="Monthly Rate (USD)"
              value={this.state.row.monthly_rate}
              onChange={this.handleChange('monthly_rate')}
              type="number"
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="photos_per_acts"
              name="photos_per_acts"
              label="Photos per activity"
              value={this.state.row.photos_per_acts}
              onChange={this.handleChange('photos_per_acts')}
              type="number"
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="free_list_cnt"
              name="free_list_cnt"
              label="Number of free listing per month"
              value={this.state.row.free_list_cnt}
              onChange={this.handleChange('free_list_cnt')}
              type="number"
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="insertion_list_fee"
              name="insertion_list_fee"
              label="Insertion fees after free listing (USD)"
              value={this.state.row.insertion_list_fee}
              onChange={this.handleChange('insertion_list_fee')}
              type="number"
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="dense"
              id="fee_paid_acts"
              name="fee_paid_acts"
              label="Insertion fees for paid activity(%)"
              value={this.state.row.fee_paid_acts}
              onChange={this.handleChange('fee_paid_acts')}
              type="number"
              variant="outlined"
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