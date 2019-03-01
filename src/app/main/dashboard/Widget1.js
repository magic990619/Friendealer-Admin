import React, {Component} from 'react';
import {withStyles, Button, Typography} from '@material-ui/core';
import {FuseAnimate} from '@fuse';
import {Bar} from 'react-chartjs-2';

const styles = theme => ({
    root: {
        background     : 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
    }
});

class Widget1 extends Component {

    state = {
        dataset: '',
        years: [],
    };

    componentDidMount() {
        const {data} = this.props;
        var years = [];
        var dataset = '';
        if (data) {
            data.map((cursor) => {
                years.push(cursor.year);
                dataset = cursor.year;
                return null;
            })
        }
        this.setState({years: years, dataset: dataset});
    }

    setDataSet = (dataset) => {
        this.setState({dataset});
    };

    render()
    {
        const {classes, data, theme} = this.props;
        const {dataset, years} = this.state;
        var dataWithColors = {};
        data && data.map((cursor) => {
            if (cursor.year === dataset) {
                var res = [];
                cursor.data.map((cur) => {
                    res.push(cur.visitors);
                    return null;
                });
                dataWithColors = {
                    label: 'accounts',
                    data: res,
                    borderColor              : theme.palette.secondary.main,
                    backgroundColor          : theme.palette.secondary.main,
                    pointBackgroundColor     : theme.palette.secondary.dark,
                    pointHoverBackgroundColor: theme.palette.secondary.main,
                    pointBorderColor         : theme.palette.secondary.contrastText,
                    pointHoverBorderColor    : theme.palette.secondary.contrastText
                };
            }
            return null;
        });

        return (
                <div className={classes.root + "flex flex-col items-center w-full"}>
                    <div className="container relative p-24 flex flex-row justify-between items-center">

                        <FuseAnimate delay={100}>
                            <div className="flex-col">
                                <Typography className="h2">Visitors</Typography>
                                <Typography className="h5" color="textSecondary">Unique visitors by month</Typography>
                            </div>
                        </FuseAnimate>

                        <div className="flex flex-row items-center">
                            {years.map((key) => (
                                <Button
                                    key={key}
                                    className="py-8 px-12"
                                    size="small"
                                    onClick={() => this.setDataSet(key)}
                                    disabled={key === dataset}
                                >
                                    {key}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="container relative pb-16">
                        <Bar height={40}
                            data={{
                                labels  : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                                datasets: [dataWithColors]
                            }}
                        />
                    </div>
                </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Widget1);
