import React, {Component} from 'react';
import api from 'app/ApiConfig'
import { withStyles, Typography } from '@material-ui/core';
import { FuseAnimate} from '@fuse';
import Paper from '@material-ui/core/Paper';

import { Transfer, Button } from 'antd';

const styles = theme => ({
  root: {
    width: '846px',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 3,
    overflowX: 'auto',
    textAlign: 'left',
  },
});

class CategoryTab extends Component {

    state = {
        mockData: [],
        targetKeys: [],
    };

    componentDidMount() {
        api.post('/auth/getIndexPageData', {})
        .then(res => {
            this.getMock(res.data.allCategories, res.data.categories);
        });
    }

    getMock = (allCategories, selectedCategories) => {
        var targetKeys = [];
        var mockData = [];

        allCategories.map((cur)=>{
            cur.sub_categories && cur.sub_categories.map((cursor)=>{
                var chosen = false;
                selectedCategories.map((tmp)=>{
                    if (tmp.name === cursor)
                        chosen = true;
                    return null;
                })
                const data = {
                    key: cursor,
                    title: cur.name,
                    sub: cursor,
                    chosen: chosen
                }
                if (data.chosen) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
                return null;
            })
            return null;
        })
        this.setState({ mockData, targetKeys });
    }

    renderFooter = () => (
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
          onClick={()=>{
            api.post('/auth/getIndexPageData', {})
            .then(res => {
                this.getMock(res.data.allCategories, res.data.categories);
            });    
          }}
        >
            reload
        </Button>
    )

    handleChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            moveKeys.map((cursor)=>{
                api.post('/auth/addCategory', {category: {name: cursor}});
                return null;
            })
        }
        else {
            moveKeys.map((cursor)=>{
                api.post('/auth/removeCategoryByName', {name: cursor});
                return null;
            })
        }
        this.setState({ targetKeys });
    }

    render() {
        const { classes } = this.props;
        const {mockData, targetKeys} = this.state;

        return (
            <div>
                <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-center">
                    <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="md:ml-24" variant="h4" color="inherit">Top Categories</Typography>
                        </FuseAnimate>
                    </div>
                </div>
                <Paper className={classes.root}>
                    <Transfer
                        dataSource={mockData}
                        titles={['Categories', 'Top Categories']}
                        showSearch
                        listStyle={{
                            textAlign: 'left',
                            width: 400,
                            height: 400,
                        }}
                        targetKeys={targetKeys}
                        onChange={this.handleChange}
                        render={item => `${item.title}-${item.sub}`}
                        footer={this.renderFooter}
                    />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(CategoryTab);