import React, {Component} from 'react';
import {GridList, GridListTile, GridListTileBar, Icon, IconButton, Typography, ListSubheader, withStyles} from '@material-ui/core';
import {FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import classNames from 'classnames';
import {fade} from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    root    : {
        background: theme.palette.primary.main,
        color     : theme.palette.getContrastText(theme.palette.primary.main)
    },
    board   : {
        cursor                  : 'pointer',
        boxShadow               : theme.shadows[0],
        transitionProperty      : 'box-shadow border-color',
        transitionDuration      : theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        background              : theme.palette.primary.light,
        color                   : theme.palette.getContrastText(theme.palette.primary.light),
        '&:hover'               : {
            boxShadow: theme.shadows[6]
        }
    },
    newBoard: {
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: fade(theme.palette.getContrastText(theme.palette.primary.main), 0.6),
        '&:hover'  : {
            borderColor: fade(theme.palette.getContrastText(theme.palette.primary.main), 0.8)
        }
    }
});

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


    render()
    {
        const photosVideos =  this.state.profileData.user_id === '' ? null : this.state.profileData.photos;
        const {classes} = this.props;

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
                                <GridList className="" spacing={8} cols={0}>
                                {photosVideos && photosVideos.map((period) => (
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
                                                    <Icon className="text-white opacity-75" onClick={(ev) => {
                                                        ev.stopPropagation();
                                                        if (window.confirm("Are you sure to delete it?")) {
                                                            this.handleDelete(period);
                                                        }
                                                    }}>delete</Icon>
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                    ))}
                                    </GridList>
                            </div>
                        {
                            (photosVideos === null || photosVideos.length === 0) && <Typography className="mr-16" variant="subscribe1">There are no photos.</Typography>
                        }
                            <div className="w-1 sm:w-1/2 md:w-1/4 m-32">
                                <div
                                    className={classNames(classes.board, classes.newBoard, "flex flex-col items-center justify-center w-full h-full rounded py-24")}
                                >
                                    <Icon className="text-56">add_circle</Icon>
                                    <Typography className="text-16 font-300 text-center pt-16 px-32" color="inherit">Add new photo</Typography>
                                </div>
                            </div>

                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(PhotosVideosTab);
