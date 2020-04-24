import React from 'react';

//HOC for infinite scroll
import withInfiniteScroll from '../../../hoc/withInfiniteScroll/withInfiniteScroll'

//Material UI Components
import List from "@material-ui/core/List"

const scrollingList = props => {
    const {children}  = props;

    return (
        <List>
            {children}
        </List>
    )
}

export default withInfiniteScroll(scrollingList);