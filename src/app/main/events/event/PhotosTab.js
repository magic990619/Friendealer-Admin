import React, {Component} from 'react';
import {GridList, GridListTile, Icon, IconButton, Typography, Button, withStyles} from '@material-ui/core';
import {FuseScrollbars, FuseAnimate, FuseAnimateGroup} from '@fuse';
import api from 'app/ApiConfig';
import TextField from '@material-ui/core/TextField';
import PhotoAddDialog from './PhotoAddDialog.js'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dropzone from 'react-dropzone'
// import moment from 'moment/moment';

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
    grid_img: {
        objectFit: 'scale-down',
        width: '100%',
        height: '80%',
    }
});
class PhotosTab extends Component {

    state = {
        open: false,
        count: 0,
        photo_url: '',
        photos: [{
            _id: '',
            event_id: '',
            photo_url: '',
            title: '',
            description: '',
            created_at: '',
        }],
        edit_photo: {
            _id: '',
            event_id: '',
            photo_url: '',
            title: '',
            description: '',
            created_at: '',
        },
    };

    componentDidMount()
    {
        const {event_id} = this.props;
        api.post('/eventphoto/getPhotosById', {
            event_id
        }).then(res => {
            this.setState({ photos: res.data.doc, count: res.data.count });
        });
    }

    handleClickOpen = (photo) => {
        this.setState({ open: true, edit_photo: photo});
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };
    
    handleSave = (photo) => {
        api.post('/eventphoto/updatePhotoById', {
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
        api.post('/eventphoto/removePhoto', {
            photo
        });
    }

    handleAdd = (photo) => {
        var photos = this.state.photos;
        photos.push(photo);
        console.log(photo);
        this.setState({photos: photos});
        api.post('/eventphoto/addPhoto', {
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
        console.log(file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return api.post("/upload", formData, config)
            .then(res => {
                console.log(res.data.file);
                edit['photo_url'] = "http://localhost:8888/uploads/" + res.data.file.filename;
                this.setState({
                edit_photo: edit,
            })});
    }

    handleDrop = (acceptedFiles, rejectedFiles) => {
        const {event_id} = this.props;
        console.log(acceptedFiles);
        let file = acceptedFiles[0];
        const formData = new FormData();

        formData.append('file',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return api.post("/upload", formData, config)
            .then(res => {
                var photo_url = "http://localhost:8888/uploads/" + res.data.file.filename;
                this.handleAdd({
                    event_id: event_id,
                    photo_url: photo_url,
                    title: 'untitled',
                    description: '',
                  });
            });
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
        const {edit_photo, count} = this.state;
        const photosVideos =  (this.state.photos === null || this.state.photos.event_id === '') ? null : this.state.photos;
        var indents = [];

        for (var index = photosVideos.length ; index < count ; index ++) {
            indents.push(index);
        }

        return (
            <div className="md:flex max-w-2xl">
                <div className="flex flex-col flex-1 md:pr-32">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <div className="flex items-center pl-0 mb-24">
                            <Typography className="mr-16" variant="h6">Photos</Typography>
                            {photosVideos && photosVideos.length < count &&
                            <PhotoAddDialog onSave={this.handleAdd} event_id={this.props.event_id}/>
                            }
                        </div>
                        <div className="items-left text-left mt-12">
                            <span className="text-18 font-bold">Add photos to attract interest to your event</span><br />
                            <span className="text-11 mt-8">Include pictures with different angles and details. You can upload a maximum number of photos with your membership, that are at least 300px wide or tall(we recommend at least 1000px)</span><br />
                            <span className="text-11">Drag and drop to add the order of your images</span>
                        </div>
                        <div className="mb-48">
                            <GridList className="" spacing={12} cols={0}>
                                {photosVideos && photosVideos.map((period) => (
                                <GridListTile
                                    classes={{
                                        root: "w-128 border-black",
                                        tile: "rounded-4 border-2"
                                    }}
                                    key={period._id}
                                >
                                    <img className={classes.grid_img + " cursor-pointer"} src={period.photo_url} alt={period.title} onClick={(ev) => {
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
                                    <div className="absolute pin-b flex justify-center w-full border-t-2">
                                        <IconButton onClick={(ev) => {
                                                ev.stopPropagation();
                                                if (window.confirm("Are you sure to delete it?")) {
                                                    this.handleDelete(period);
                                                }
                                            }}>
                                            <Icon className="text-blue">delete</Icon>
                                        </IconButton>
                                    </div>
                                </GridListTile>
                                ))}
                                {photosVideos && indents.map((cursor) => (
                                    <GridListTile
                                        classes={{
                                            root: "w-128 border-black",
                                            tile: "rounded-4 border-2"
                                            }}
                                        key={cursor}>
                                        <Dropzone onDrop={this.handleDrop}>
                                            {({getRootProps, getInputProps, isDragActive}) => {
                                            return (
                                                <div
                                                {...getRootProps()}
                                                >
                                                <input {...getInputProps()} />
                                                {
                                                    isDragActive ?
                                                    <div className="w-full h-full bg-white cursor-pointer">
                                                        <i className="mt-40 fa fa-plus text-blue text-40 align-middle"></i>
                                                        <p className="text-14 mt-12">Drop here...</p>
                                                    </div> :
                                                    <div className="cursor-pointer">
                                                        <i className="mt-40 fa fa-plus text-grey text-40 align-middle"></i>
                                                        <div className="absolute pin-b flex justify-center w-full border-t-2 h-52">
                                                        </div>
                                                    </div>
                                                }
                                                </div>
                                            )
                                            }}
                                        </Dropzone>
                                    </GridListTile>
                                ))
                                }
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

export default withStyles(styles, {withTheme: true})(PhotosTab);
