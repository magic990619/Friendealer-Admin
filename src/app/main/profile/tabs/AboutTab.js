import React, {Component} from 'react';
import { AppBar, Button, Card, CardContent, Icon, IconButton, List, Toolbar, Typography, Input} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

class AboutTab extends Component {

    state = {
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

    componentDidMount()
    {
        this.getUserProfile();
    }
    getUserProfile = () => {
        const {user_id} = this.props;

        api.post('/auth/getUserProfileById', {
            user_id
        }).then(res => {
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
        api.post('/auth/saveUserProfileById', {
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
            if (cursor.language.localeCompare(event.target.value) != 0) {
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
            if (cursor.language.localeCompare(lang.language) != 0) {
                res.push(cursor);
            }
        });
        profile.language_browse = res;
        this.setState({ profileData: profile });
    }
      
    render()
    {
        // console.log(this.state.profileData);

        var languages = this.state.profileData == undefined ? ['English'] : this.state.profileData.language_browse;
        var friends = this.state.profileData == undefined ? null : this.state.profileData.friends;

        return (
            <div className="md:flex max-w-2xl">

{this.state.profileData &&
                <div className="flex flex-col md:w-320">
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
                        label="Last Name"
                        id="last_name"
                        name="last_name"
                        value={this.state.profileData.last_name}
                        onChange={this.handleChange('last_name')}
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
                        label="Hourly Rate"
                        id="hourly_rate"
                        name="hourly_rate"
                        value={this.state.profileData.hourly_rate}
                        onChange={this.handleChange('hourly_rate')}
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
                        label="City"
                        id="city"
                        name="city"
                        value={this.state.profileData.city}
                        onChange={this.handleChange('city')}
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
                        label="State & Province"
                        id="state_province"
                        name="state_province"
                        value={this.state.profileData.state_province}
                        onChange={this.handleChange('state_province')}
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
                        label="Company"
                        id="company"
                        name="company"
                        value={this.state.profileData.company}
                        onChange={this.handleChange('company')}
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
                <div className="flex flex-col md:w-320">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <TextField
                            className="mb-24"
                            label="Headline"
                            id="headline"
                            name="headline"
                            value={this.state.profileData.headline}
                            onChange={this.handleChange('headline')}
                            multiline
                            rows={3}
                            margin="normal"
                        />

                        <TextField
                            className="mb-24"
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

                        <div>
                        <InputLabel shrink htmlFor="language-label-placeholder">
                            Language
                        </InputLabel>
                        <Select
                            className="mb-24"
                            native
                            value={this.state.profileData.language}
                            onChange={this.handleChange('language')}
                            input={
                            <Input
                                name="language"
                                id="language"
                            />
                            }
                            fullWidth
                        >
                            <option value="English">English</option>
                            <option value="Russian">Russian</option>
                            <option value="French">Franch</option>
                            <option value="German">German</option>
                        </Select>
                        </div>

                        <div>
                            <InputLabel shrink htmlFor="language-label-placeholder">
                                Language for browse project
                            </InputLabel>
                            <Select
                                className="mb-24"
                                native
                                value="default"
                                onChange={this.handleAddLanguage}
                                input={
                                <Input
                                    name="language"
                                    id="language"
                                />
                                }
                                fullWidth
                            >
                                <option value="default">Add Language</option>
                                <option value="English">English</option>
                                <option value="Russian">Russian</option>
                                <option value="French">Franch</option>
                                <option value="German">German</option>
                            </Select>
                                <div>
                            {
                                languages && languages.map((lang) => (
                                    <Chip
                                    key={lang.language}
                                    label={lang.language}
                                    onDelete={this.handleDeleteLanguage(lang)}
                                    color="primary"
                                    />    
                                ))
                            }
                            </div>
                        </div>
                    </FuseAnimateGroup>
                </div>
}

                <div className="flex flex-col md:w-320">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <Card className="w-full mb-16">
                            <AppBar position="static" elevation={0}>
                                <Toolbar className="pl-16 pr-8">
                                    <Typography variant="subtitle1" color="inherit" className="flex-1">
                                        Friends
                                    </Typography>
                                    {/* <Button className="normal-case" color="inherit" size="small">See 454 more</Button> */}
                                </Toolbar>
                            </AppBar>
                            <CardContent className="p-0">
                                <List className="p-8">
                                    {friends && friends.map((friend) => (
                                        <img key={friend.friend_id} className="w-64 m-4" src={friend.avatar} alt={friend.name} />
                                    ))}
                                </List>
                            </CardContent>
                        </Card>

                        <Button variant="contained" color="secondary" className="normal-case" onClick={this.handleSave}>
                        Save
                    </Button>


                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default AboutTab;
