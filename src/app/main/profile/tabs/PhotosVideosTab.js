import React, {Component} from 'react';
import {GridList, GridListTile, GridListTileBar, Icon, IconButton, Typography, ListSubheader} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';

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

    handleChange = name => event => {
        var cursor = this.state.profileData;
        cursor[name] = event.target.value;
        this.setState({
            profileData: cursor,
        });
    };

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


    render()
    {
        const photosVideos = this.state.profileData.photos;

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
                        {photosVideos && photosVideos.map((period) => (
                            <div key={period.id} className="mb-48">
                                <GridList className="" spacing={8} cols={0}>
                                    <GridListTile
                                        classes={{
                                            root: "w-1 sm:w-1/2 md:w-1/4",
                                            tile: "rounded-8"
                                        }}
                                    >
                                        <img src={period.photo_url} alt={period.comment}/>
                                        <GridListTileBar
                                            title={period.comment}
                                            actionIcon={
                                                <IconButton>
                                                    <Icon className="text-white opacity-75">info</Icon>
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                </GridList>
                            </div>
                        ))}
                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default PhotosVideosTab;
