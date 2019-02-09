import React, {Component} from 'react';
import {Icon, Table, TableBody, TableCell, TablePagination, TableRow, IconButton} from '@material-ui/core';
import {FuseScrollbars} from '@fuse';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import EventsTableHead from './EventsTableHead';
import * as Actions from '../store/actions';
import moment from 'moment/moment';
import api from 'app/ApiConfig.js';

class EventsTable extends Component {

    state = {
        order      : 'asc',
        orderBy    : null,
        selected   : [],
        data       : this.props.events,
        page       : 0,
        rowsPerPage: 10
    };

    componentDidMount()
    {
        this.props.getEvents();
    }

    componentDidUpdate(prevProps, prevState)
    {
        if ( !_.isEqual(this.props.events, prevProps.events) || !_.isEqual(this.props.searchText, prevProps.searchText) )
        {
            this.props.getEvents().then(()=>{
                const data = this.getFilteredArray(this.props.events, this.props.searchText);
                this.setState({data: data})
            });
        }
    }

    getFilteredArray = (data, searchText) => {
        if ( searchText.length === 0 )
        {
            return data;
        }
        return _.filter(data, item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if ( this.state.orderBy === property && this.state.order === 'desc' )
        {
            order = 'asc';
        }

        this.setState({
            order,
            orderBy
        });
    };

    handleSelectAllClick = event => {
        if ( event.target.checked )
        {
            this.setState(state => ({selected: this.state.data.map(n => n._id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (item) => {
        this.props.history.push('/events/events/' + item._id);
    };

    handleCheck = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if ( selectedIndex === -1 )
        {
            newSelected = newSelected.concat(selected, id);
        }
        else if ( selectedIndex === 0 )
        {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if ( selectedIndex === selected.length - 1 )
        {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if ( selectedIndex > 0 )
        {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    removeEmployerProfile = (form) => {
        api.post('/profile/removePostedEvent', {
            employer_email: form.employer_email,
            event_id: form._id,
        })
    }

    render()
    {
        const {order, orderBy, selected, rowsPerPage, page, data} = this.state;

        return (
            <div className="w-full flex flex-col">

                <FuseScrollbars className="flex-grow overflow-x-auto">

                    <Table className="min-w-xl" aria-labelledby="tableTitle">

                        <EventsTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data && data.length}
                        />

                        <TableBody>
                            {_.orderBy(data, [
                                (o) => {
                                    switch ( orderBy )
                                    {
                                        case 'category':
                                        {
                                            return o.category[0];
                                        }
                                        default:
                                        {
                                            return o[orderBy];
                                        }
                                    }
                                }
                            ], [order])
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n._id);
                                    return (
                                        <TableRow
                                            className="h-64 cursor-pointer"
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n._id}
                                            selected={isSelected}
                                            onClick={event => this.handleClick(n)}
                                        >
                                            <TableCell className="w-48 pl-4 sm:pl-12">
                                                {moment(n.created_at).format('YYYY/MM/DD hh:mm:ss A')}
                                            </TableCell>

                                            <TableCell component="th" scope="row">
                                                {n.name}
                                            </TableCell>

                                            <TableCell className="truncate" component="th" scope="row">
                                                {n.category.join(', ')}
                                            </TableCell>

                                            <TableCell component="th" scope="row" align="right">
                                                <span>$</span>
                                                {n.cost_min}
                                            </TableCell>

                                            <TableCell component="th" scope="row" align="right">
                                                <span>$</span>
                                                {n.cost_max}
                                            </TableCell>

                                            <TableCell component="th" scope="row" align="right">
                                                {n.visitors}
                                                <i className={classNames("inline-block w-8 h-8 rounded ml-8", n.visitors <= 5 && "bg-red", n.visitors > 5 && n.visitors <= 25 && "bg-orange", n.visitors > 25 && "bg-green")}/>
                                            </TableCell>

                                            <TableCell component="th" scope="row" align="right">
                                                {n.event_state}
                                            </TableCell>

                                            <TableCell component="th" scope="row" align="center">
                                                <IconButton onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    if (window.confirm('Are you sure to delete it?')) {
                                                        this.props.removeEvent(n);
                                                        this.removeEmployerProfile(n);
                                                    }
                                                }}>
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </FuseScrollbars>

                <TablePagination
                    component="div"
                    count={data && data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page'
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page'
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getEvents: Actions.getEvents,
        removeEvent: Actions.removeEvent
    }, dispatch);
}

function mapStateToProps({eCommerceApp})
{
    return {
        events  : eCommerceApp.events.data,
        searchText: eCommerceApp.events.searchText
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventsTable));
