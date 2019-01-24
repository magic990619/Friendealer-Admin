import React, {Component} from 'react';
import api from 'app/ApiConfig'
import { withStyles, Typography } from '@material-ui/core';
import {FusePageSimple, FuseAnimate} from '@fuse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FaqDialog from './FaqDialog'

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

class Fag extends Component {

    state = {
        rows : [],
    };

    componentDidMount() {
        api.post('/faq/getAllFaqs', {})
        .then(res => {
            this.setState({rows: res.data.doc});
        });
    }

    handleSave = (row, type) => {
        var rows = this.state.rows;
        var res = [];
        console.log(row);
        if (type === 'edit') {
            api.post('/faq/updateFaq', {row});
            rows.forEach(function(cur, err) {
                if (cur._id != row._id)
                    res.push(cur);
                else res.push(row);
            });
        }
        else {
            api.post('/faq/addFaq', {row}).then(res=>row._id=res.data.doc._id);
            res = rows;
            res.push(row);
        }
        console.log(res);
        this.setState({rows: res});
    }

    handleRemove = (row) => {
        var rows = this.state.rows;
        var res = [];

        api.post('/faq/removeFaq', {row});

        rows.forEach(function(cur, err) {
            if (cur._id != row._id)
                res.push(cur);
        });
        this.setState({rows: res});
    }

  render() {
    const { classes } = this.props;
    return (
        <div>
            <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
            <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="md:ml-24" variant="h4" color="inherit">FAQ</Typography>
                </FuseAnimate>
            </div>

            <FaqDialog type='add' onSave={this.handleSave} onRemove={this.handleRemove} row={{_id: '', title: '', subtitle: '', description: ''}}/>
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
                    {this.state.rows.map(row => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="left">{row.subtitle}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="center">
                                <FaqDialog type='edit' onSave={this.handleSave} onRemove={this.handleRemove} row={row}/>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Fag);