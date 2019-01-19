import React, {Component} from 'react';
import {FuseExample, FusePageSimple} from '@fuse';
import {Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';

const styles = theme => ({
    layoutRoot: {}
});

class Users extends Component {

    render()
    {
        const {classes} = this.props;
        return (
            <FusePageSimple classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <Typography variant="h6">User Management</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl mx-auto">
                    <Typography className="text-32 mt-32 mb-8" component="h2">View all users</Typography>
                    <Typography className="mb-16" component="div"><FuseExample
                        className="my-24"
                        iframe={false}
                        component={require('app/main/users/EnhancedTable.js').default}
                        
                    /></Typography>
                </div>
            }
        />

        )
    }
}

export default withStyles(styles, {withTheme: true})(Users);