import React from 'react';
import {AppBar, MuiThemeProvider, Toolbar, Typography} from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';

const FooterLayout1 = ({classes, footerTheme}) => {

    return (
        <MuiThemeProvider theme={footerTheme}>
            <AppBar id="fuse-footer" className="relative z-10" color="default">
                <Toolbar className="px-16 py-0 flex items-center">
                    <Typography>
                        Friendealer @ 2019
                    </Typography>
                </Toolbar>
            </AppBar>
        </MuiThemeProvider>
    );
};

function mapStateToProps({fuse})
{
    return {
        footerTheme: fuse.settings.footerTheme
    }
}

export default connect(mapStateToProps)(FooterLayout1);
