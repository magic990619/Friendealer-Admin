import React, {Component} from 'react';
import {
    withStyles,
    Button,
    Card,
    CardContent,
    Icon,
    TextField,
    Typography,
    CardActions,
    Divider,
    Input,
    Paper,
} from '@material-ui/core';
import {FuseAnimate, FuseAnimateGroup, FuseChipSelect, FuseUtils} from '@fuse';
import withReducer from 'app/store/withReducer';
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import api from 'app/ApiConfig';

const styles = theme => ({
    header    : {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color     : theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position     : 'absolute',
        top          : -64,
        left         : 0,
        opacity      : .04,
        fontSize     : 512,
        width        : 512,
        height       : 512,
        pointerEvents: 'none'
    }
});

class Categories extends Component {

    state = {
        open: false,
        categories: [],
        searchText: '',
        is_add: false,
        edit_category: {
            name: '',
            icon: '',
            sub_categories: [],
            active: true,
            created_at: '',
        },
    };

    componentDidMount() {
        this.props.getCategories().then(()=>{
            const {categories} = this.props;
            this.setState({categories: categories});
        });
    }

    componentDidUpdate(prevProps, prevState) {

        if ( !_.isEqual(this.props.categories, prevProps.categories) )
        {
            this.props.getCategories().then(()=>{
                const {categories} = this.props;
                this.setState({categories: categories});
            });
        }
    }

    handleClickOpen = (category, is_add) => {
        this.setState({ open: true, edit_category: category, is_add: is_add});
    };
    
    handleClose = () => {
        this.setState({open: false});
    };

    handleselectedFile = e => {
        let file = e.target.files[0];
        const formData = new FormData();
        var edit = this.state.edit_category;
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
                edit['icon'] = res.data.file.filename;
                this.setState({
                edit_category: edit,
            })});
    }

    handleEditName = event => {
        this.setState({edit_category: _.set({...this.state.edit_category}, 'name', event.target.value)});
    }

    handleChipChange = (value, name) => {
        this.setState({edit_category: _.set({...this.state.edit_category}, name, value.map(item => item.value))});
    };

    setSearchText = event => {
        this.setState({searchText: event.target.value});
    }

    getFilteredArray = (entities, searchText) => {
        const arr = Object.keys(entities).map((id) => entities[id]);
        if ( searchText.length === 0 )
        {
            return arr;
        }
        return FuseUtils.filterArrayByString(arr, searchText);
    };

    render() {
        const {edit_category} = this.state;
        const {classes} = this.props;
        var categories = this.getFilteredArray(this.state.categories, this.state.searchText);

        return (
            <div className="w-full">
                <div className={classNames(classes.header, "relative overflow-hidden flex flex-col items-center justify-center text-center p-16 sm:p-24 h-100 sm:h-188")}>
                    <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                        <Typography color="inherit" className="text-24 sm:text-40 font-light">
                            WELCOME TO CATEGORIES
                        </Typography>
                    </FuseAnimate>
                    <FuseAnimate duration={400} delay={600}>
                        <Typography variant="subtitle1" color="inherit" className="mt-8 sm:mt-16 mx-auto max-w-512">
                            <span className="opacity-75">
                                You can add and delete main categories and sub skills here.
                            </span>
                        </Typography>
                    </FuseAnimate>
                    <Icon className={classes.headerIcon}>category</Icon>
                    <Button
                        className="justify-center px-10"
                        color="secondary"
                        onClick={(ev) => {
                            ev.stopPropagation();
                            this.handleClickOpen({
                                name: '',
                                icon: '',
                                sub_categories: [],
                                active: true,
                                created_at: '',
                            }, true);
                        }}
                    > Add Category </Button>
                </div>
                <div className="max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
                  <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>
                                <Icon className="mr-8" color="action">search</Icon>
                                <Input
                                    placeholder="Search for anything"
                                    className="flex flex-1"
                                    disableUnderline
                                    fullWidth
                                    value={this.state.searchText}
                                    inputProps={{
                                        'aria-label': 'Search'
                                    }}
                                    onChange={this.setSearchText}
                                />
                            </Paper>
                        </FuseAnimate>
                    </div>
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                        className="flex flex-wrap py-24"
                    >
                        { (categories == null || categories.length === 0) && (
                            <div className="flex flex-1 items-center justify-center">
                                <Typography color="textSecondary" className="text-24 my-24">
                                    No categories found!
                                </Typography>
                            </div>
                        )}

                        {categories.map((category) => {
                            return (
                                <div className="w-full pb-12 sm:w-1/3 lg:w-1/4 sm:p-16" key={category._id}>
                                    <Card elevation={1} className="flex flex-col">
                                        <div
                                            className="flex flex-no-shrink items-center justify-between px-24 h-48"
                                        >
                                            {category.sub_categories && 
                                            <Typography className="font-medium truncate" color="inherit">[{category.sub_categories.length}] categories</Typography>
                                            }
                                            <div className="flex items-center justify-center opacity-75">
                                            </div>
                                        </div>
                                        <CardContent className="flex flex-col flex-auto items-center justify-center">
                                            <img className="w-64" src={'http://localhost:8888/uploads/' + category.icon} alt="icon"/>
                                            <Typography className="text-center text-16 font-800">{category.name}</Typography>
                                        </CardContent>
                                        <Divider/>
                                        <CardActions className="justify-center">
                                            <Button
                                                className="justify-center px-10"
                                                color="secondary"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    this.handleClickOpen(category, false);
                                                }}
                                            > Edit </Button>
                                            <Dialog
                                                open={this.state.open}
                                                onClose={this.handleClose}
                                                aria-labelledby="form-dialog-title"
                                                >
                                                <div>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                        Please enter category details here.
                                                        </DialogContentText>
                                                        <TextField
                                                            autoFocus
                                                            className="m-4"
                                                            id="name"
                                                            name="name"
                                                            label="Name"
                                                            value={edit_category.name}
                                                            onChange={this.handleEditName}
                                                            fullWidth
                                                        />
                                                        Icon: <input type='file' id='icon' name='icon' onChange={this.handleselectedFile} />
                                                        <FuseChipSelect
                                                            className="mt-8 mb-32"
                                                            value={
                                                                edit_category.sub_categories.map(item => ({
                                                                    value: item,
                                                                    label: item
                                                                }))
                                                            }
                                                            onChange={(value) => this.handleChipChange(value, 'sub_categories')}
                                                            placeholder="Select multiple categories"
                                                            textFieldProps={{
                                                                label          : 'Categories',
                                                                InputLabelProps: {
                                                                    shrink: true
                                                                },
                                                                variant        : 'outlined'
                                                            }}
                                                            isMulti
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                    {this.state.is_add === false &&
                                                        <Button onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            this.props.updateCategory(edit_category);
                                                            this.handleClose();
                                                        }} color="primary">
                                                            Save
                                                        </Button>
                                                        }
                                                        {this.state.is_add === true &&
                                                        <Button onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            this.props.addCategory(edit_category);
                                                            this.handleClose();
                                                        }} color="primary">
                                                            Add
                                                        </Button>
                                                        }
                                                        <Button onClick={this.handleClose} color="primary">
                                                            Cancel
                                                        </Button>
                                                    </DialogActions>
                                                </div>
                                            </Dialog>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })}
                    </FuseAnimateGroup>
                </div>

            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getCategories    : Actions.getCategories,
        updateCategory   : Actions.updateCategory,
        addCategory      : Actions.addCategory,
    }, dispatch);
}

function mapStateToProps({reducers})
{
    return {
        categories    : reducers.categoriesReducer.categories,
    }
}

export default withReducer('reducers', reducer)(withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(Categories)));
