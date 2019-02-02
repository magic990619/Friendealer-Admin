import React from 'react';
import {withStyles, Card, Icon, Typography} from '@material-ui/core';
import {Bar} from 'react-chartjs-2';

const Widget2 = ({data, theme}) => {

    return (
        <Card className="w-full rounded-8 shadow-none border-1">

            <div className="p-16 pb-0 flex flex-row flex-wrap items-end bg-green-lighter">

                <div className="pr-16">
                    <Typography className="h3" color="textSecondary">Hire Accounts</Typography>
                    <Typography className="text-56 font-300 leading-none mt-8">
                        {data.value}
                    </Typography>
                </div>

                <div className="py-4 text-16 flex flex-row items-center">
                    <div className="flex flex-row items-center">
                        {data.ofTarget > 0 && (
                            <Icon className="text-green mr-4">trending_up</Icon>
                        )}
                        {data.ofTarget < 0 && (
                            <Icon className="text-red mr-4">trending_down</Icon>
                        )}
                        <Typography>{data.ofTarget}%</Typography>
                    </div>
                    <Typography className="ml-4 whitespace-no-wrap">of target</Typography>
                </div>

            </div>
        </Card>
    );
};

export default withStyles(null, {withTheme: true})(Widget2);
