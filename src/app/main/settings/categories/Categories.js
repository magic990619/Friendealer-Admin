import React, {Component} from 'react';
import {
    withStyles,
    Button,
    Card,
    CardContent,
    // OutlinedInput,
    Icon,
    // TextField,
    Typography,
    CardActions,
    Divider,
    // Select,
    // InputLabel,
    // FormControl,
    // MenuItem,
    // LinearProgress
} from '@material-ui/core';
import {FuseAnimate, FuseAnimateGroup} from '@fuse';
import withReducer from 'app/store/withReducer';
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
// import _ from '@lodash';
// import {Link} from 'react-router-dom';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import {amber, blue, blueGrey, green} from '@material-ui/core/colors';

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
        categories: []
    };

    componentDidMount() {
        this.props.getCategories().then(()=>{
            const {categories} = this.props;
            this.setState({categories: categories});
            console.log(this.state.categories);
        });
    }

    componentDidUpdate(prevProps, prevState) {
    }

    categoryIcon = (iconName) => {
        var imgUrl = "assets/images/categories/" + iconName + ".png";
        return (
            <img className="w-64" src={imgUrl} alt="icon"/>
        )
    }

    moveCategoryOrderToPrev = (category) => {

    }

    moveCategoryOrderToPrev = (category) => {
        
    }

    render() {
        const {categories} = this.state;
        const {classes, theme} = this.props;
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
                </div>
                <div className="max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
                    <FuseAnimateGroup
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                        className="flex flex-wrap py-24"
                    >
                        { categories != null && categories.length === 0 && (
                            <div className="flex flex-1 items-center justify-center">
                                <Typography color="textSecondary" className="text-24 my-24">
                                    No categories found!
                                </Typography>
                            </div>
                        )}

                        {categories.map((category) => {
                            var backgroundColor = null;
                            if (Number(category.array_no) % 4 === 0) {
                                backgroundColor = blue[500];
                            } else if (Number(category.array_no) % 4 === 1) {
                                backgroundColor = blueGrey[500];
                            } else if (Number(category.array_no) % 4 === 2) {
                                backgroundColor = green[500];
                            } else if (Number(category.array_no) % 4 === 2) {
                                backgroundColor = amber[500];
                            }
                            var first = false, last = false;
                            if (category == categories[0]) {
                                first = true;
                            }
                            if (category == categories[categories.length - 1]) {
                                last = true;
                            }
                            return (
                                <div className="w-full pb-12 sm:w-1/3 lg:w-1/4 sm:p-16" key={category._id}>
                                    <Card elevation={1} className="flex flex-col h-200">
                                        <div
                                            className="flex flex-no-shrink items-center justify-between px-24 h-48"
                                            style={{
                                                background: backgroundColor,
                                                color     : theme.palette.getContrastText(backgroundColor)
                                            }}
                                        >
                                            <Typography className="font-medium truncate" color="inherit">[{category.skills.length}] Skills</Typography>
                                            <div className="flex items-center justify-center opacity-75">
                                                <Icon className="text-20 mr-8" color="inherit">category</Icon>
                                                {/* <div className="text-16 whitespace-no-wrap">{course.length} min</div> */}
                                            </div>
                                        </div>
                                        <CardContent className="flex flex-col flex-auto items-center justify-center">
                                            {this.categoryIcon(category.icon)}
                                            <Typography className="text-center text-16 font-800">{category.name}</Typography>
                                        </CardContent>
                                        <Divider/>
                                        <CardActions className="justify-center">
                                            { !first && (
                                                <Button
                                                    className="justify-left px-32"
                                                    color="secondary"
                                                    onClick={this.moveCategoryOrderToPrev(category)}
                                                > <Icon className="text-20 mr-8" color="inherit">chevron_left</Icon> 
                                                </Button>)
                                            }
                                            <Button
                                                className="justify-center px-10"
                                                color="secondary"
                                            > Edit </Button>
                                            { !last && (
                                                <Button
                                                    className="justify-right px-10"
                                                    color="secondary"
                                                > <Icon className="text-20 mr-8" color="inherit">chevron_right</Icon> 
                                                </Button>)
                                            }
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
    }, dispatch);
}

function mapStateToProps({reducers})
{
    return {
        categories    : reducers.categoriesReducer.categories,
    }
}

export default withReducer('reducers', reducer)(withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(Categories)));
