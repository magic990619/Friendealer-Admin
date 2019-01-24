import React, {Component} from 'react';
import {GridList, GridListTile, GridListTileBar, Icon, IconButton, Typography, ListSubheader} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import PhotoEditDialog from './PhotoEditDialog.js'
import PhotoAddDialog from './PhotoAddDialog.js'

class PhotosVideosTab extends Component {

    state = {
        photosVideos: [],
        profileData: {
            user_id: '',
            photos: {
                photo_url: String,
                comment: String,
            },
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

    handleSave = () => {
        var profile = this.state.profileData;
        api.post('/auth/saveUserProfileById', {
            profile
        });
    }

    handleDelete = (cursor) => {
        var profile = this.state.profileData;
        var photos = profile.photos;
        var res = [];
        photos.forEach(function(photo, err) {
            if (photo.photo_url !== cursor.photo_url) {
                res.push(photo);
            }
        });
        profile.photos = res;
        this.setState({profileData: profile});
        this.handleSave();
    }

    handleURLSave = (prev_url, upload_url, comment) => {
        var profile = this.state.profileData;
        var photos = profile.photos;
        var res = [];
        photos.forEach(function(photo, err) {
            var cursor = photo;
            if (photo.photo_url === prev_url) {
                cursor.photo_url = upload_url;
                cursor.comment = comment;
            }
            res.push(cursor);
        })
        profile.photos = res;
        this.setState({profileData: profile});
        this.handleSave();
    }

    handleURLAdd = (upload_url, comment) => {
        var profile = this.state.profileData;
        var photos = profile.photos;
        photos.push({photo_url: upload_url, comment: comment});
        profile.photos = photos;
        this.setState({profileData: profile});
        this.handleSave();
    }

    render()
    {
        const photosVideos =  (this.state.profileData === null || this.state.profileData.user_id === '') ? null : this.state.profileData.photos;

        console.log(this.state.profileData);
        console.log(photosVideos);

        return (
            <div className="md:flex max-w-2xl">
                <div className="flex flex-col flex-1 md:pr-32">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <ListSubheader component="div" className="flex items-center pl-0 mb-24">
                            <Typography className="mr-16" variant="h6">Portfolio</Typography>
                        </ListSubheader>
                        <div className="mb-48">
                            <GridList className="" spacing={8} cols={0} children="">
                            {photosVideos && photosVideos.map((period, i) => (
                                <GridListTile
                                    classes={{
                                        root: "w-1 sm:w-1/2 md:w-1/4",
                                        tile: "rounded-8"
                                    }}
                                    key={i}
                                >
                                    <img src={period.photo_url} alt={period.comment}/>
                                    <GridListTileBar
                                        title={period.comment}
                                        actionIcon={
                                            <div className="flex min-w-32">
                                                <PhotoEditDialog photo_url={period.photo_url} comment={period.comment} onSave={this.handleURLSave}/>
                                                <IconButton>
                                                    <Icon className="text-white opacity-75" onClick={(ev) => {
                                                        ev.stopPropagation();
                                                        if (window.confirm("Are you sure to delete it?")) {
                                                            this.handleDelete(period);
                                                        }
                                                    }}>delete</Icon>
                                                </IconButton>
                                            </div>
                                        }
                                    />
                                </GridListTile>
                                ))}
                                {
                                    (photosVideos === null || photosVideos.length === 0) && 
                                    <div>
                                        <Typography className="mr-16" variant="subtitle1">There are no photos.</Typography>
                                    </div>
                                }
                            </GridList>
                        </div>
                            <div className="w-1 sm:w-1/2 md:w-1/4 m-32">
                                <PhotoAddDialog onSave={this.handleURLAdd}/>
                            </div>

                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default PhotosVideosTab;
