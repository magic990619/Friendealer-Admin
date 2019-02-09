import React, {Component} from 'react';
import {GridList, GridListTile, GridListTileBar, Icon, IconButton, Typography, ListSubheader, Button, withStyles, Avatar} from '@material-ui/core';
import {FuseScrollbars, FuseAnimate, FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import TextField from '@material-ui/core/TextField';
import PhotoAddDialog from './PhotoAddDialog.js'
import PhotoAddComment from './PhotoAddComment.js'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import moment from 'moment/moment';

const styles = theme => ({
    form: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '600px',
      },
    edit: {
        width: '100%',
        height: '100%',
    },
    imageshow: {
        width: '60%',
    },
    editshow: {
        width: '40%'
    },
    image: {
        width: '100%',
    },
    '& .bubble': {
        backgroundColor        : theme.palette.secondary.main,
        color                  : theme.palette.secondary.contrastText,
        borderTopLeftRadius    : 5,
        borderBottomLeftRadius : 5,
        borderTopRightRadius   : 20,
        borderBottomRightRadius: 20,
        '& .time'              : {
            marginLeft: 12
        }
    },
    '&:hover'               : {
        boxShadow                    : theme.shadows[5],
        opacity: 1
    },
});
class PhotosVideosTab extends Component {

    state = {
        open: false,
        photo_url: '',
        photos: [{
            _id: '',
            user_id: '',
            photo_url: '',
            title: '',
            description: '',
            comment: [{
                user_id: '',
                name: '',
                avatar: '',
                message: '',
                created_at: '',
            }],
            created_at: '',
        }],
        edit_photo: {
            _id: '',
            user_id: '',
            photo_url: '',
            title: '',
            description: '',
            comment: [{
                user_id: '',
                name: '',
                avatar: '',
                message: '',
                created_at: '',
            }],
            created_at: '',
        },
    };

    componentDidMount()
    {
        const {user_id} = this.props;
        api.post('/photo/getPhotosById', {
            user_id
        }).then(res => {
            this.setState({ photos: res.data.doc });
        });
    }

    handleClickOpen = (photo) => {
        this.setState({ open: true, edit_photo: photo});
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };
    
    handleSave = (photo) => {
        api.post('/photo/updatePhotoById', {
            photo
        });
    }

    handleDelete = (photo) => {
        var photos = this.state.photos;
        var res = [];
        photos.forEach(function(cursor, err) {
            if (cursor._id !== photo._id) {
                res.push(cursor);
            }
        });
        this.setState({photos: res});
        api.post('/photo/removePhoto', {
            photo
        });
    }

    handleAdd = (photo) => {
        var photos = this.state.photos;
        photos.push(photo);
        this.setState({photos: photos});
        api.post('/photo/addPhoto', {
            photo
        });
    }

    handleEditChange = name => event => {
        var edit = this.state.edit_photo;
        edit[name] = event.target.value;
        this.setState({edit_photo: edit});
    }

    handleselectedFile = e => {
        let file = e.target.files[0];
        const formData = new FormData();
        var edit = this.state.edit_photo;
        formData.append('file',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return api.post("/upload", formData, config)
            .then(res => {
                edit['photo_url'] = "http://localhost:8888/uploads/" + res.data.file.filename;
                this.setState({
                edit_photo: edit,
            })});
    }

    handleDeleteComment = comment => {
        var photo = this.state.edit_photo;
        var comments = photo.comment;
        var res = [];
        comments.forEach(function(cursor, err) {
            if (cursor !== comment)
                res.push(cursor);
        });
        photo.comment = res;
        this.setState({edit_photo: photo});
    }

    handleAddComment = (photo, comment) => {
        api.post('/photo/addComment', {
            photo, comment
        }).then(res => {
            this.setState({ photos: res.data.doc });
        });
        // const {user_id} = this.props;
        // api.post('/photo/getPhotosById', {
        //     user_id
        // }).then(res => {
        //     this.setState({ photos: res.data.doc });
        // });
    }

    nextImage = (handle) => {
        const {edit_photo, photos} = this.state;
        var prv = null, res = null;
        var flag = false;
        if (handle === 1) {
            photos.forEach(function(cursor, err) {
                if (cursor._id === edit_photo._id) res = prv;
                prv = cursor;
            })
        }
        else {
            photos.forEach(function(cursor, err) {
                if (flag === true) {
                    res = cursor;
                }
                if (cursor._id === edit_photo._id)
                    flag = true;
            })
        }
        if (res !== null) this.setState({edit_photo: res});
    }

    render()
    {
        const {classes} = this.props;
        const {edit_photo} = this.state;
        const photosVideos =  (this.state.photos === null || this.state.photos.user_id === '') ? null : this.state.photos;
        const comments = edit_photo.comment;

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
                            <PhotoAddDialog onSave={this.handleAdd} user_id={this.props.user_id}/>
                        </ListSubheader>
                        <div className="mb-48">
                            <GridList className="" spacing={8} cols={0} children="">
                            {photosVideos && photosVideos.map((period) => (
                                <GridListTile
                                    classes={{
                                        root: "w-1 sm:w-1/2 md:w-1/4",
                                        tile: "rounded-8"
                                    }}
                                    key={period._id}
                                >
                                    <img src={period.photo_url} alt={period.title} onClick={(ev) => {
                                        ev.stopPropagation();
                                        this.handleClickOpen(period);
                                    }}/>
                                    <Dialog
                                        open={this.state.open}
                                        onClose={this.handleClose}
                                        aria-labelledby="form-dialog-title"
                                        fullWidth={true}
                                        maxWidth="md"
                                        >
                                        {/* <DialogTitle id="form-dialog-title">Photo</DialogTitle> */}
                                        <div className={classes.form}>
                                            {photosVideos && photosVideos.map((cursor) => {
                                                if (cursor.photo_url === edit_photo.photo_url) {
                                                    return (
                                                        <FuseAnimate animation="transition.slideLeftIn" delay={300} key={edit_photo.photo_url}>
                                                        <div className={classes.imageshow + ' bg-black block'}>
                                                            <img src={edit_photo.photo_url} alt={period.title} className={classes.image}/>
                                                            <span className="hover cursor-pointer absolute p-16 font-bold text-18 text-grey-lighter select-none pin-l opacity-75" onClick={(ev)=>{
                                                                ev.stopPropagation();
                                                                this.nextImage(1);
                                                            }}>&#10094;</span>
                                                            <span className="hover cursor-pointer absolute p-16 font-bold text-18 text-grey-lighter select-none pin-r opacity-75" onClick={(ev)=>{
                                                                ev.stopPropagation();
                                                                this.nextImage(-1);
                                                            }}>&#10095;</span>
                                                        </div>
                                                        </FuseAnimate>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <FuseAnimate animation="transition.slideLeftIn" delay={300} key={cursor.photo_url}>
                                                        <div className={classes.imageshow + ' bg-black hidden'}>
                                                            <img src={cursor.photo_url} alt={period.title} className={classes.image}/>
                                                        </div>
                                                        </FuseAnimate>
                                                    );
                                                }
                                            })}
                                            <FuseScrollbars className={classes.editshow}>
                                            <div>
                                            <DialogContent>
                                                <DialogContentText>
                                                Please enter photo details here.
                                                </DialogContentText>
                                                <input type='file' id='photo_url' name='photo_url' onChange={this.handleselectedFile} />
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="title"
                                                    name="title"
                                                    label="Title"
                                                    value={edit_photo.title}
                                                    onChange={this.handleEditChange('title')}
                                                    fullWidth
                                                />
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="description"
                                                    name="description"
                                                    label="Description"
                                                    value={edit_photo.description}
                                                    onChange={this.handleEditChange('description')}
                                                    variant="outlined"
                                                    multiline
                                                    rows="3"
                                                    fullWidth
                                                />
                                                {comments && comments.map((comment) => (
                                                    <div className="flex flex-row" key={comment.name+comment.created_at}>
                                                        <div>
                                                            <Avatar src={comment.avatar}/>
                                                        </div>
                                                        <div className="bubble items-center justify-center p-12 max-w-full">
                                                            <div className="flex leading-tight whitespace-pre-wrap">{comment.name}
                                                            <Typography className="time w-full text-11 mx-4"
                                                                        color="textSecondary">{moment(comment.created_at).format('MMMM Do YYYY, h:mm:ss a')}</Typography>
                                                            </div>
                                                            <div className="m-4 leading-tight whitespace-pre-wrap">{comment.message}</div>
                                                        </div>
                                                        <div><IconButton>
                                                            <Icon onClick={(ev) => {
                                                                ev.stopPropagation();
                                                                this.handleDeleteComment(comment);
                                                            }}>delete</Icon>
                                                        </IconButton></div>
                                                    </div>
                                                ))}
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    this.handleSave(edit_photo);
                                                    this.handleClose();
                                                }} color="primary">
                                                    Save
                                                </Button>
                                                <Button onClick={this.handleClose} color="primary">
                                                    Cancel
                                                </Button>
                                            </DialogActions>
                                            </div>
                                            </FuseScrollbars>
                                        </div>
                                    </Dialog>
                                    <GridListTileBar
                                        title={period.title}
                                        actionIcon={
                                            <div className="flex min-w-32">
                                                <PhotoAddComment photo={period} onAddComment={this.handleAddComment}/>
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
                                        <Typography className="mr-16" variant="subtitle1">No photos found</Typography>
                                    </div>
                                }
                            </GridList>
                        </div>
                    </FuseAnimateGroup>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(PhotosVideosTab);
