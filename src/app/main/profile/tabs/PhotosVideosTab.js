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
        const {photosVideos} = this.state;

        return (
            <div className="md:flex max-w-2xl">
                <div className="flex flex-col flex-1 md:pr-32">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        {photosVideos.map((period) => (
                            <div key={period.id} className="mb-48">

                                <ListSubheader component="div" className="flex items-center pl-0 mb-24">
                                    <Typography className="mr-16" variant="h6">{period.name}</Typography>
                                    <Typography variant="subtitle1" color="textSecondary">{period.info}</Typography>
                                </ListSubheader>

                                <GridList className="" spacing={8} cols={0}>
                                    {period.media.map(media => (
                                        <GridListTile
                                            classes={{
                                                root: "w-1 sm:w-1/2 md:w-1/4",
                                                tile: "rounded-8"
                                            }}
                                            key={media.preview}
                                        >
                                            <img src={media.preview} alt={media.title}/>
                                            <GridListTileBar
                                                title={media.title}
                                                actionIcon={
                                                    <IconButton>
                                                        <Icon className="text-white opacity-75">info</Icon>
                                                    </IconButton>
                                                }
                                            />
                                        </GridListTile>
                                    ))}
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
