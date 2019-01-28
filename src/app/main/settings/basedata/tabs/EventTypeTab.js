import React, {Component} from 'react';
import api from 'app/ApiConfig'
import PropTypes from 'prop-types';
import { withStyles, Typography, Icon, Input, Tooltip,} from '@material-ui/core';
import { FuseUtils, FuseAnimate} from '@fuse';
import Table from '@material-ui/core/Table';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EventTypeDialog from './EventTypeDialog'


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
    { id: 'name', numeric: false, disablePadding: true, label: 'Event Type' },
    { id: 'budget', numeric: true, disablePadding: false, label: 'Budget' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
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
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class EventTypeTab extends Component {

    state = {
        searchText: '',
        rows : [],
        order: 'asc',
        orderBy: 'name',
    };

    componentDidMount() {
        api.post('/base/getAllEventTypes', {})
        .then(res => {
            this.setState({rows: res.data.doc});
        });
    }

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

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
    };

    handleSave = (eventtype, type) => {
        var rows = this.state.rows;
        var res = [];
        console.log(eventtype);
        if (type === 'edit') {
            api.post('/base/updateEventType', {eventtype});
            rows.forEach(function(cur, err) {
                if (cur._id !== eventtype._id)
                    res.push(cur);
                else res.push(eventtype);
            });
        }
        else {
            api.post('/base/addEventType', {eventtype}).then(res => eventtype._id = res.data.doc._id);
            res = rows;
            res.push(eventtype);
        }
        console.log(res);
        this.setState({rows: res});
    }

    handleRemove = (row) => {
        var rows = this.state.rows;
        var res = [];

        api.post('/base/removeEventTypeById', {_id: row._id});

        rows.forEach(function(cur, err) {
            if (cur._id !== row._id)
                res.push(cur);
        });
        this.setState({rows: res});
    }

    render() {
        const { classes } = this.props;
        const {order, orderBy} = this.state;
        var data = this.getFilteredArray(this.state.rows, this.state.searchText);
        data = stableSort(data, getSorting(order, orderBy));
        return (
            <div>
                <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                    <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="md:ml-24" variant="h4" color="inherit">Event Type</Typography>
                        </FuseAnimate>
                    </div>
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
                    <EventTypeDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{_id: '', name: '', budget: ''}}/>
                </div>
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
                                <TableCell component="th" scope="row" align="center">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.budget}</TableCell>
                                <TableCell align="center">
                                    <EventTypeDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row}/>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            data.length === 0 && 
                            <TableRow>
                            <TableCell align="center">
                            'No event types.'
                            </TableCell>
                            </TableRow>
                        }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(EventTypeTab);