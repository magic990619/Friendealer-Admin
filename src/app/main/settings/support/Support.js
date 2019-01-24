import React, {Component} from 'react';
import api from 'app/ApiConfig'
import { withStyles, Typography, Icon, Input } from '@material-ui/core';
import { FuseUtils, FuseAnimate} from '@fuse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SupportDialog from './SupportDialog'

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

class Support extends Component {

    state = {
        searchText: '',
        rows : [],
    };

    componentDidMount() {
        api.post('/support/getAllSupports', {})
        .then(res => {
            this.setState({rows: res.data.doc});
        });
    }

    setSearchText = event => {
        this.setState({searchText: event.target.value});
    }

    handleSave = (row, type) => {
        var rows = this.state.rows;
        var res = [];
        console.log(row);
        if (type === 'edit') {
            api.post('/support/updateSupport', {row});
            rows.forEach(function(cur, err) {
                if (cur._id !== row._id)
                    res.push(cur);
                else res.push(row);
            });
        }
        else {
            api.post('/support/addSupport', {row}).then(res=>row._id=res.data.doc._id);
            res = rows;
            res.push(row);
        }
        console.log(res);
        this.setState({rows: res});
    }

    handleRemove = (row) => {
        var rows = this.state.rows;
        var res = [];

        api.post('/support/removeSupport', {row});

        rows.forEach(function(cur, err) {
            if (cur._id !== row._id)
                res.push(cur);
        });
        this.setState({rows: res});
    }

    getFilteredArray = (entities, searchText) => {
        const arr = Object.keys(entities).map((id) => entities[id]);
        if ( searchText.length === 0 )
        {
            return arr;
        }
        return FuseUtils.filterArrayByString(arr, searchText);
    };

  render() {
    const { classes } = this.props;
    const data = this.getFilteredArray(this.state.rows, this.state.searchText);
    return (
        <div>
            <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="md:ml-24" variant="h4" color="inherit">Get Supports</Typography>
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
            <SupportDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{_id: '', title: '', subtitle: '', description: ''}}/>
        </div>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Title</TableCell>
                        <TableCell align="left">Subtitle</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map(row => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="left">{row.subtitle}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="center">
                                <SupportDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row}/>
                            </TableCell>
                        </TableRow>
                    ))}
                    {
                        data.length === 0 && 
                        <TableRow>
                        <TableCell align="center">
                        'No support messages.'
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

export default withStyles(styles)(Support);