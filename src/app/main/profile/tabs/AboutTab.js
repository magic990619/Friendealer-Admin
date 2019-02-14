import React, {Component} from 'react';
import { Button, Input} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import _ from '@lodash';

const newProfile = {
    profileData: {
        user_id: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        hourly_rate: '',
        address: '',
        city: '',
        zip_code: '',
        state_province: '',
        country: '',
        company: '',
        time_zone: '',
        location: '',
        headline: '',
        description: '',
        language: '',
        language_browse: [ {
            language: '',
        }],
        friends: [ {
            friend_id: '',
            name: '',
            avatar: '',
            is_favourite: '',
            created_at: '',
        }],
    },
};
class AboutTab extends Component {

    state = {...newProfile};

    componentDidMount()
    {
        this.getUserProfile();
    }

    componentDidUpdate(prevProps, prevState)
    {
        if ( !_.isEqual(this.props.location, prevProps.location) || this.props.user_id !== prevProps.user_id)
        {
            this.getUserProfile();
        }
    }


    getUserProfile = () => {
        const {user_id} = this.props;

        api.post('/profile/getUserProfileById', {
            user_id
        }).then(res => { res.data.doc &&
            this.setState({ profileData: res.data.doc });
        });
    }

    handleChange = name => event => {
        var cursor = this.state.profileData;
        cursor[name] = event.target.value;
        this.setState({
            profileData: cursor,
        });
    };

    handleSave = () => {
        var profile = this.state.profileData;
        profile.user_id = this.props.user_id;
        api.post('/profile/saveUserProfileById', {
            profile
        });
    }

    handleAddLanguage = event => {
        console.log(event.target.value);
        var profile = this.state.profileData;
        var languages = this.state.profileData.language_browse;
        var res = [];
        languages.forEach(function(cursor, err) {
            console.log(cursor.language);
            if (cursor.language.localeCompare(event.target.value) !== 0) {
                res.push(cursor);
            }
        });
        res.push( { language: event.target.value } );
        profile.language_browse = res;
        this.setState({ profileData: profile });
    }

    handleDeleteLanguage = lang => () => {
        // console.log(lang);
        var profile = this.state.profileData;
        var languages = this.state.profileData.language_browse;
        var res = [];
        languages.forEach(function(cursor, err) {
            if (cursor.language.localeCompare(lang.language) !== 0) {
                res.push(cursor);
            }
        });
        profile.language_browse = res;
        this.setState({ profileData: profile });
    }

    handleDeleteFriend = friend_id => {
        var profile = this.state.profileData;
        var friends = this.state.profileData.friends;
        var res = [];
        friends.forEach(function(cursor, err) {
            if (cursor.friend_id !== friend_id) {
                res.push(cursor);
            }
        });
        profile.friends = res;
        this.setState({ profileData: profile });
    }

    handleClear = () => {
        this.setState(newProfile);
    }
      
    render()
    {
        // console.log(this.state.profileData);

        var languages = this.state.profileData.language_browse;

        // console.log(friends);

        return (
            <div className="md:flex max-w-full">
{this.state.profileData &&
                <div className="flex flex-col md:w-400">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <TextField
                            className="mb-24"
                            label="First Name"
                            id="first_name"
                            name="first_name"
                            value={this.state.profileData.first_name}
                            onChange={this.handleChange('first_name')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Phone Number"
                            id="phone_number"
                            name="phone_number"
                            value={this.state.profileData.phone_number}
                            onChange={this.handleChange('phone_number')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Address"
                            id="address"
                            name="address"
                            value={this.state.profileData.address}
                            onChange={this.handleChange('address')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Zip Code"
                            id="zip_code"
                            name="zip_code"
                            value={this.state.profileData.zip_code}
                            onChange={this.handleChange('zip_code')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Country"
                            id="country"
                            name="country"
                            value={this.state.profileData.country}
                            onChange={this.handleChange('country')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Time Zone"
                            id="time_zone"
                            name="time_zone"
                            value={this.state.profileData.time_zone}
                            onChange={this.handleChange('time_zone')}
                            margin="normal"
                        />
                    </FuseAnimateGroup>
                </div>
}
{this.state.profileData &&
                <div className="flex flex-col md:w-400">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <TextField
                            className="mb-24"
                            label="Last Name"
                            id="last_name"
                            name="last_name"
                            value={this.state.profileData.last_name}
                            onChange={this.handleChange('last_name')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Hourly Rate"
                            id="hourly_rate"
                            name="hourly_rate"
                            value={this.state.profileData.hourly_rate}
                            onChange={this.handleChange('hourly_rate')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="City"
                            id="city"
                            name="city"
                            value={this.state.profileData.city}
                            onChange={this.handleChange('city')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="State & Province"
                            id="state_province"
                            name="state_province"
                            value={this.state.profileData.state_province}
                            onChange={this.handleChange('state_province')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Company"
                            id="company"
                            name="company"
                            value={this.state.profileData.company}
                            onChange={this.handleChange('company')}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
                            label="Location"
                            id="location"
                            name="location"
                            value={this.state.profileData.location}
                            onChange={this.handleChange('location')}
                            margin="normal"
                        />
                    </FuseAnimateGroup>
                </div>
}
{
this.state.profileData &&
                <div className="flex flex-col md:w-lg">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <TextField
                            className="mb-24 w-sm"
                            label="Headline"
                            id="headline"
                            name="headline"
                            value={this.state.profileData.headline}
                            onChange={this.handleChange('headline')}
                            margin="normal"
                        />

                        <div>
                        <TextField
                            className="mb-24 w-sm"
                            label="Description"
                            id="description"
                            name="description"
                            value={this.state.profileData.description}
                            onChange={this.handleChange('description')}
                            variant="outlined"
                            multiline
                            rows={10}
                            margin="normal"
                        />
                        </div>

                        <div>
                            <InputLabel shrink htmlFor="language-label-placeholder">
                                Language
                            </InputLabel>
                            <div>
                                <Select
                                    className="mb-24 w-sm"
                                    native
                                    value={this.state.profileData.language}
                                    onChange={this.handleChange('language')}
                                    input={
                                    <Input
                                        name="language"
                                        id="language"
                                    />
                                    }
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">Franch</option>
                                    <option value="German">German</option>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <InputLabel shrink htmlFor="language-label-placeholder">
                                Language for browse project
                            </InputLabel>
                            <div>
                                <Select
                                    className="mb-24 w-sm"
                                    native
                                    value="default"
                                    onChange={this.handleAddLanguage}
                                    input={
                                    <Input
                                        name="language"
                                        id="language"
                                    />
                                    }
                                >
                                    <option value="default">Add Language</option>
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">Franch</option>
                                    <option value="German">German</option>
                                </Select>
                            </div>
                            <div>
                            {
                                languages && languages.map((lang) => (
                                    <Chip
                                    key={lang.language}
                                    label={lang.language}
                                    onDelete={this.handleDeleteLanguage(lang)}
                                    color="default"
                                    />    
                                ))
                            }
                            </div>
                        </div>
                    </FuseAnimateGroup>
                </div>
}
                <div className="mr-60">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <div className="flex">
                            <Button variant="contained" color="secondary" className="m-12 min-w-76" onClick={this.handleSave}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" className="m-12 min-w-76" onClick={this.handleClear}>
                                Clear
                            </Button>
                        </div>
                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default AboutTab;
