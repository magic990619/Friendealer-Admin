import React, {Component} from 'react';
import api from 'app/ApiConfig'
import PropTypes from 'prop-types';
import {withStyles, Button, Typography, Icon, IconButton, Tooltip } from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import _ from '@lodash';
import MembershipDialog from './MembershipDialog';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
  
const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'yearly_rate', numeric: true, disablePadding: false, label: 'Annual Rate (USD)' },
    { id: 'monthly_rate', numeric: true, disablePadding: false, label: 'Montly Rate (USD)' },
    { id: 'photos_per_acts', numeric: true, disablePadding: false, label: 'Photos per activity' },
    { id: 'free_list_cnt', numeric: true, disablePadding: false, label: 'Number of free listing per month' },
    { id: 'insertion_list_fee', numeric: true, disablePadding: false, label: 'Insertion fees after free listing (USD)' },
    { id: 'fee_paid_acts', numeric: true, disablePadding: false, label: 'Insertion fees for paid activity(%)' },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy } = this.props;

        return (
        <TableHead>
            <TableRow>
            {rows.map(row => {
                return (
                <TableCell
                    key={row.id}
                    align="center"
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === row.id ? order : false}
                >
                    <Tooltip
                    title="Sort"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                    >
                    <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                    >
                        {row.label}
                    </TableSortLabel>
                    </Tooltip>
                </TableCell>
                );
            }, this)}
            </TableRow>
        </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};
  
const styles = theme => ({
    layoutHeader : {
        height                        : 320,
        minHeight                     : 320,
        [theme.breakpoints.down('md')]: {
            height   : 240,
            minHeight: 240
        }
    }
});

class MembershipPage extends Component {

    state = {
        order: 'asc',
        orderBy: 'monthly_rate',
        rows: [],
    };

    componentDidMount() {
        api.post('/base/getAllMemberships', {})
        .then(res => {
            this.setState({rows: res.data.doc});
        });
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
    };

    handleSave = (row, type) => {
        var rows = this.state.rows;
        var res = [];
        console.log(row);
        if (type === 'edit') {
            api.post('/base/updateMembership', {membership: row});
            rows.forEach(function(cur, err) {
                if (cur._id !== row._id)
                    res.push(cur);
                else res.push(row);
            });
        }
        else {
            api.post('/base/addNewMembership', {membership: row}).then(res=>row._id=res.data.doc._id);
            res = rows;
            res.push(row);
        }
        console.log(res);
        this.setState({rows: res});
    }

    handleRemove = (row) => {
        var rows = this.state.rows;
        var res = [];

        api.post('/base/removeMembershipById', {_id: row._id});

        rows.forEach(function(cur, err) {
            if (cur._id !== row._id)
                res.push(cur);
        });
        this.setState({rows: res});
    }

    render()
    {
        const { classes } = this.props;
        const {order, orderBy} = this.state;
        var data = stableSort(this.state.rows, getSorting(order, orderBy));

        return (
            <FusePageSimple
                classes={{
                    // header : classes.layoutHeader,
                    toolbar: "px-16 sm:px-24"
                }}
                header={
                    <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                        <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                            <div className="flex items-center">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-12">card_membership</Icon>
                                </FuseAnimate>
                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                    <Typography variant="h6" className="hidden sm:flex">Membership</Typography>
                                </FuseAnimate>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <MembershipDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{
                                name: '',
                                yearly_rate: '',
                                monthly_rate: '',
                                photos_per_acts: '',
                                free_list_cnt: '',
                                insertion_list_fee: '',
                                fee_paid_acts: '',
                            }}/>
                            <Button className="normal-case" variant="contained" color="primary" aria-label="Send Message">Send Message</Button>
                        </div>
                    </div>
                }
                content={
                    <div>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    />
                                <TableBody>
                                {data.map(row => (
                                    <TableRow key={row._id}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.yearly_rate}</TableCell>
                                        <TableCell align="center">{row.monthly_rate}</TableCell>
                                        <TableCell align="center">{row.photos_per_acts}</TableCell>
                                        <TableCell align="center">{row.free_list_cnt}</TableCell>
                                        <TableCell align="center">{row.insertion_list_fee}</TableCell>
                                        <TableCell align="center">{row.fee_paid_acts}</TableCell>
                                        <TableCell align="center">
                                            <MembershipDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {
                                    data.length === 0 && 
                                    <TableRow>
                                    <TableCell align="center">
                                    'No memberships found.'
                                    </TableCell>
                                    </TableRow>
                                }
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                }
            />
        );
    };
}

export default withStyles(styles, {withTheme: true})(MembershipPage);
