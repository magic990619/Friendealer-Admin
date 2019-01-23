import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from 'app/ApiConfig'
import {
    Icon, IconButton,
} from '@material-ui/core';

export default class FormDialog extends React.Component {
  state = {
    open: false,
    row: {
        joiner_email: '',
        employeer_email: '',
        event_id: '',
        event_name: '',
        rating_clarity: '',
        rating_quality: '',
        rating_communication: '',
        rating_payment: '',
        rating_expertise: '',
        rating_professionalism: '',
        rating_work_again: '',
        rating_hire_again: '',
        feedback: '',
        created_at: '',
    }
  };

  componentDidMount()
  {
    this.setState( { row: this.props.row } );
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
      var cursor = this.state.row;
      cursor[name] = event.target.value;
      this.setState({row: cursor});
  }

  handleSave = () => {
    const {person} = this.props;
    var profile = this.props.profileData;
    var row = this.state.row;
    var feedbacks = person == 0 ? profile.provide_feedback : profile.receive_feedback;
    feedbacks.forEach(function(feedback, err) {
        var cursor = feedback;
        if (feedback.user_id === row.user_id && feedback.event_id.localeCompare(row.event_id) === 0) {
            cursor.feedback = row.feedback;
            cursor.rating_communication = parseInt(row.rating_communication);
            cursor.rating_professionalism = parseInt(row.rating_professionalism);
            if (person == 0) {
                cursor.rating_quality = parseInt(row.rating_quality);
                cursor.rating_expertise = parseInt(row.rating_expertise);
                cursor.rating_hire_again = parseInt(row.rating_hire_again);
            }
            else {
                cursor.rating_clarity = parseInt(row.rating_clarity);
                cursor.rating_payment = parseInt(row.rating_payment);
                cursor.rating_work_again = parseInt(row.rating_work_again);
            }
        }
    });
    // if (person == 0)
    //     profile.provide_feedback = res;
    // else profile.receive_feedback = res;
    api.post('/auth/saveUserProfileById', {
        profile
    });
    this.handleClose();
    this.props.onRefresh();
  }

  handleDelete = () => {
    const {person} = this.props;
    var profile = this.props.profileData;
    var row = this.state.row;
    var feedbacks = person == 0 ? profile.provide_feedback : profile.receive_feedback;
    var res = [];
    feedbacks.forEach(function(feedback, err) {
        if (feedback.user_id !== row.user_id || feedback.event_id.localeCompare(row.event_id) !== 0) {
            res.push(feedback);
        }
    });
    if (person == 0)
        profile.provide_feedback = res;
    else profile.receive_feedback = res;
    api.post('/auth/saveUserProfileById', {
        profile
    });
    this.props.onRefresh();
  }

  render() {
      const {person} = this.props;
    return (
      <div>
        <IconButton
            onClick={(ev) => {
                ev.stopPropagation();
                this.handleClickOpen();
            }}
        >
            <Icon>edit_attributes</Icon>
        </IconButton>
        <IconButton
            onClick={(ev) => {
                ev.stopPropagation();
                if (window.confirm('Are you sure to delete it?')) {
                    this.handleDelete();
                }
            }}
        >
            <Icon>delete</Icon>
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit to this feedback, please enter description here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="feedback"
              name="feedback"
              label="Feedback"
              value={this.state.row.feedback}
              onChange={this.handleChange('feedback')}
              variant="outlined"
              multiline
              rows={7}
              fullWidth
            />
            <div>
            <TextField
                    id="rating_quality"
                    label={person == 0 ? "Rating for quality" : "Rating for clarity"}
                    value={person == 0 ? this.state.row.rating_quality : this.state.row.rating_clarity}
                    onChange={person == 0 ? this.handleChange('rating_quality') : this.handleChange('rating_clarity')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    id="rating_communication"
                    label="Rating for communication"
                    value={this.state.row.rating_communication}
                    onChange={this.handleChange('rating_communication')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    id="rating_expertise"
                    label={person == 0 ? "Rating for expertise" : "Rating for payment"}
                    value={person == 0 ? this.state.row.rating_expertise : this.state.row.rating_payment}
                    onChange={person == 0 ? this.handleChange('rating_expertise') : this.handleChange('rating_payment')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    id="rating_professionalism"
                    label="Rating for professionalism"
                    value={this.state.row.rating_professionalism}
                    onChange={this.handleChange('rating_professionalism')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    id="rating_hire_again"
                    label={person == 0 ? "Rating for hire again" : "Rating for work again"}
                    value={person == 0 ? this.state.row.rating_hire_again : this.state.row.rating_work_again}
                    onChange={person == 0 ? this.handleChange('rating_hire_again') : this.handleChange('rating_work_again')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
            </div>
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