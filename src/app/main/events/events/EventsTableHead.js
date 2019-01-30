import React from 'react';
import {
    TableHead,
    TableSortLabel,
    TableCell,
    TableRow,
    Tooltip,
    withStyles
} from '@material-ui/core';

const rows = [
    {
        id            : 'created_at',
        align         : 'left',
        disablePadding: false,
        label         : 'Created At',
        sort          : true
    },
    {
        id            : 'name',
        align         : 'left',
        disablePadding: false,
        label         : 'Name',
        sort          : true
    },
    {
        id            : 'category',
        align         : 'left',
        disablePadding: false,
        label         : 'Category',
        sort          : true
    },
    {
        id            : 'cost-min',
        align         : 'right',
        disablePadding: false,
        label         : 'Min Price',
        sort          : true
    },
    {
        id            : 'cost-max',
        align         : 'right',
        disablePadding: false,
        label         : 'Max Price',
        sort          : true
    },
    {
        id            : 'quantity',
        align         : 'right',
        disablePadding: false,
        label         : 'Quantity',
        sort          : true
    },
    {
        id            : 'event-state',
        align         : 'right',
        disablePadding: false,
        label         : 'State',
        sort          : true
    },
    {
        id            : 'action',
        align         : 'right',
        disablePadding: false,
        label         : 'Action',
        sort          : false
    },
];

const styles = theme => ({
    actionsButtonWrapper: {
        background: theme.palette.background.paper
    }
});

class EventsTableHead extends React.Component {
    state = {
        selectedEventsMenu: null
    };

    createSortHandler = property => event => {

        this.props.onRequestSort(event, property);
    };

    openSelectedEventsMenu = (event) => {
        this.setState({selectedEventsMenu: event.currentTarget});
    };

    closeSelectedEventsMenu = () => {
        this.setState({selectedEventsMenu: null});
    };

    render()
    {
        const {order, orderBy} = this.props;

        return (
            <TableHead>
                <TableRow className="h-64">
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                align={row.align}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                {row.sort && (
                                    <Tooltip
                                        title="Sort"
                                        placement={row.align === "right" ? 'bottom-end' : 'bottom-start'}
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
                                )}
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles, {withTheme: true})(EventsTableHead);
