import React from 'react';
import {withStyles, Button, Card, Divider, Icon, IconButton, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';

const Widget6 = ({data}) => {
    return (
        <Card className="w-full rounded-8 shadow-none border-1">

            <div className="p-16 pr-4 flex flex-row items-center justify-between">

                <Typography className="h1 pr-16">Activity States</Typography>

            </div>

            <table className="simple clickable">
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-right">Count</th>
                        <th className="text-right">Percent</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                        <td>New</td>
                        <td className="text-right">{data.new}</td>
                        <td className="text-right">{parseInt(data.new * 100 / data.total)}%</td>
                    </tr>
                    <tr>
                        <td>On Progress</td>
                        <td className="text-right">{data.progress}</td>
                        <td className="text-right">{parseInt(data.progress * 100 / data.total)}%</td>
                    </tr>
                    <tr>
                        <td>Finished</td>
                        <td className="text-right">{data.finished}</td>
                        <td className="text-right">{parseInt(data.finished * 100 / data.total)}%</td>
                    </tr>
                    <tr>
                        <td>Closed</td>
                        <td className="text-right">{data.closed}</td>
                        <td className="text-right">{parseInt(data.closed * 100 / data.total)}%</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td className="text-right">{data.total}</td>
                        <td className="text-right"></td>
                    </tr>
                </tbody>
            </table>

            <Divider className="card-divider w-full"/>

            <div className="p-8 pt-16 flex flex-row items-center">
                <Button component={Link} to="/events">GO TO EVENTS</Button>
            </div>
        </Card>
    );
};

export default withStyles(null, {withTheme: true})(Widget6);
