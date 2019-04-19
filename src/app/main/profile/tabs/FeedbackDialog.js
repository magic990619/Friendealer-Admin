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
import _ from '@lodash';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import StarRatingComponent from 'react-star-rating-component';
import {SERVER_URL} from 'app/ServerUrl.js';

export default class FormDialog extends React.Component {
  state = {
    open: false,
    row: {
        joiner_email: '',
        employeer_email: '',
        event_id: '',
        event_name: '',
        delivered_budget: 'Yes',
        delivered_time: 'Yes',
        rating_clarity: 0,
        rating_quality: 0,
        rating_communication: 0,
        rating_payment: 0,
        rating_expertise: 0,
        rating_professionalism: 0,
        rating_work_again: 0,
        rating_hire_again: 0,
        photo: [''],
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

  onStarClick(nextValue, prevValue, name) {
    this.setState({row: _.set({...this.state.row}, name, nextValue)});
  }

  handleChange = name => event => {
      var cursor = this.state.row;
      cursor[name] = event.target.value;
      this.setState({row: cursor});
  }

  handleSave = () => {
    const {person} = this.props;
    var profile = this.props.profileData;
    var row = this.state.row;
    var feedbacks = person === false ? profile.provide_feedback : profile.receive_feedback;
    feedbacks.forEach(function(feedback, err) {
        var cursor = feedback;
        if (feedback.user_id === row.user_id && feedback.event_id.localeCompare(row.event_id) === 0) {
            cursor.feedback = row.feedback;
            cursor.rating_communication = parseInt(row.rating_communication);
            cursor.rating_professionalism = parseInt(row.rating_professionalism);
            if (person === false) {
                cursor.rating_quality = parseInt(row.rating_quality);
                cursor.rating_expertise = parseInt(row.rating_expertise);
                cursor.rating_hire_again = parseInt(row.rating_hire_again);
            }
            else {
                cursor.rating_clarity = parseInt(row.rating_clarity);
                cursor.rating_payment = parseInt(row.rating_payment);
                cursor.rating_work_again = parseInt(row.rating_work_again);
            }
            cursor.photo = row.photo;
        }
    });
    // if (person == 0)
    //     profile.provide_feedback = res;
    // else profile.receive_feedback = res;
    api.post('/profile/saveUserProfileById', {
        profile
    });
    this.handleClose();
    this.props.onRefresh();
  }

  handleDelete = () => {
    const {person} = this.props;
    var profile = this.props.profileData;
    var row = this.state.row;
    var feedbacks = person === false ? profile.provide_feedback : profile.receive_feedback;
    var res = [];
    feedbacks.forEach(function(feedback, err) {
        if (feedback.user_id !== row.user_id || feedback.event_id.localeCompare(row.event_id) !== 0) {
            res.push(feedback);
        }
    });
    if (person === false)
        profile.provide_feedback = res;
    else profile.receive_feedback = res;
    api.post('/profile/saveUserProfileById', {
        profile
    });
    this.props.onRefresh();
  }

  handleselectedFile = num => e => {
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
            var photo = this.state.row.photo;
            var resT = [];
            photo.map((cur, i) => {
                if (i === parseInt(num)) resT.push(SERVER_URL + res.data.file.filename);
                else resT.push(cur);
                return null;
            })
            photo = resT;
            this.setState({row: _.set({...this.state.row}, 'photo', photo)})
        }
    );
  }

  handleAddPhoto = () => {
    var photo = this.state.row.photo;
    if (photo === undefined) photo = [''];
    else photo.push('');
    this.setState({row: _.set({...this.state.row}, 'photo', photo)})
}

  render() {
    const {person} = this.props;
    const {row} = this.state;

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
            <div className="mt-16">
                <FormControl component="fieldset">
                    <FormLabel component="legend">Was this delivered on budget?</FormLabel>
                    <RadioGroup
                        className="flex flex-row"
                        aria-label="Gender"
                        name="gender1"
                        value={this.state.row.delivered_budget}
                        onChange={this.handleChange('delivered_budget')}
                    >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Was this delivered on time?</FormLabel>
                    <RadioGroup
                        className="flex flex-row"
                        aria-label="Gender"
                        name="gender1"
                        value={this.state.row.delivered_time}
                        onChange={this.handleChange('delivered_time')}
                    >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </div>
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
                <div className="flex items-center">
                    <h3 className="min-w-160">{person === false ? "Quality" : "Clarity"} </h3>
                    <StarRatingComponent className="text-32"
                        name={person === false ? "rating_quality" : "rating_clarity"}
                        starCount={5}
                        value={person === false ? parseInt(this.state.row.rating_quality) : parseInt(this.state.row.rating_clarity)}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="min-w-160">Communication </h3>
                    <StarRatingComponent className="text-32"
                        name="rating_communication" 
                        starCount={5}
                        value={parseInt(this.state.row.rating_communication)}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="min-w-160">{person === false ? "Expertise" : "Payment"} </h3>
                    <StarRatingComponent className="text-32"
                        name={person === false ? "rating_expertise" : "rating_payment"}
                        starCount={5}
                        value={person === false ? parseInt(this.state.row.rating_expertise) : parseInt(this.state.row.rating_payment)}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="min-w-160">Professionalism</h3>
                    <StarRatingComponent className="text-32"
                        name="rating_professionalism" 
                        starCount={5}
                        value={parseInt(this.state.row.rating_professionalism)}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </div>
                <div className="flex items-center">
                    <h3 className="min-w-160">{person === false ? "Hire again" : "Work again"} </h3>
                    <StarRatingComponent className="text-32"
                        name={person === false ? "rating_hire_again" : "rating_work_again"}
                        starCount={5}
                        value={person === false ? parseInt(this.state.row.rating_hire_again) : parseInt(this.state.row.rating_work_again)}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </div>
            </div>
            <div>
                {row.photo && row.photo.length === 0 && <span>No photos found</span>}
                {(!row.photo || row.photo.length < 5) &&
                    <Button onClick={this.handleAddPhoto} color="secondary">
                        Add photo
                    </Button>
                }
                {row.photo && row.photo.length !== 0 && row.photo.map((cursor, i) => (
                    <div key={i}>
                        <span>Photo {i + 1}:   </span>
                        <input type='file' id='photo' name='photo' onChange={this.handleselectedFile(i)} />
                    </div>
                ))
                }
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