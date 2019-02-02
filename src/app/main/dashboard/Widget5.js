import React, {Component} from 'react';
import {withStyles, Card, Typography} from '@material-ui/core';
import {HorizontalBar} from 'react-chartjs-2';

class Widget5 extends Component {

    state = {
    };

    render()
    {
        const {data, theme} = this.props;
        const dataWithColors = [{
            label: 'accounts',
            data: [data.free, data.basic, data.premuim, data.premiumpro],
            borderColor         : theme.palette.divider,
            backgroundColor     : [
                theme.palette.primary.main,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.light,
            ],
            hoverBackgroundColor: [
                theme.palette.secondary.light,
                theme.palette.secondary.main,
                theme.palette.secondary.light,
                theme.palette.secondary.main,
            ]
        }];
        return (
            <Card className="w-full rounded-8 shadow-none border-1">

                <div className="p-16">
                    <Typography className="h1 font-300">Membership Usage</Typography>
                </div>

                <div className="h-224 relative items-center w-full max-w-md">
                    <HorizontalBar
                        data={{
                            labels  : ["Free", "Basic", "Premium", "Premium Pro"],
                            datasets: dataWithColors
                        }}
                        options={{
                            maintainAspectRatio: true,
                        }}
                    />
                </div>

            </Card>
        );
    }
}

export default withStyles(null, {withTheme: true})(Widget5);
