import React, {Component} from 'react';
import {withStyles, Card, Icon, Typography} from '@material-ui/core';
import {Doughnut} from 'react-chartjs-2';

class Widget7 extends Component {

    state = {
    };

    render()
    {
        const {data, theme} = this.props;
        const dataWithColors = [{
            data: [data.desktop, data.mobile],
            borderColor         : theme.palette.divider,
            backgroundColor     : [
                theme.palette.primary.main,
                theme.palette.primary.light,
            ],
            hoverBackgroundColor: [
                theme.palette.secondary.light,
                theme.palette.secondary.main,
            ]
        }];
        return (
            <Card className="w-full rounded-8 shadow-none border-1">

                <div className="p-16">
                    <Typography className="h1 font-300">Sessions by device</Typography>
                </div>

                <div className="h-224 relative items-center w-full max-w-md">
                    <Doughnut
                        data={{
                            labels  : ["Desktop", "Mobile"],
                            datasets: dataWithColors
                        }}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                </div>

                <div className="p-16 flex flex-row items-center justify-center">
                    <div className="px-16 flex flex-col items-center">
                        <Typography className="h4" color="textSecondary">Desktop</Typography>
                        <div className="flex flex-row items-center justify-center">
                            {data.desktop < data.mobile && (
                                <Icon className="text-18 pr-4 text-red">
                                    arrow_downward
                                </Icon>
                            )}

                            {data.desktop > data.mobile && (
                                <Icon className="text-18 pr-4 text-green">
                                    arrow_upward
                                </Icon>
                            )}
                            <Typography className="h2 font-300 py-8">{parseInt(data.desktop * 100 / (data.desktop + data.mobile))}%</Typography>
                        </div>
                    </div>
                    <div className="px-16 flex flex-col items-center">
                        <Typography className="h4" color="textSecondary">Desktop</Typography>
                        <div className="flex flex-row items-center justify-center">
                            {data.desktop > data.mobile && (
                                <Icon className="text-18 pr-4 text-red">
                                    arrow_downward
                                </Icon>
                            )}

                            {data.desktop < data.mobile && (
                                <Icon className="text-18 pr-4 text-green">
                                    arrow_upward
                                </Icon>
                            )}
                            <Typography className="h2 font-300 py-8">{parseInt(data.mobile * 100 / (data.desktop + data.mobile))}%</Typography>
                        </div>
                    </div>
                </div>

            </Card>
        );
    }
}

export default withStyles(null, {withTheme: true})(Widget7);
