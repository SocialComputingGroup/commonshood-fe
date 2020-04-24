import React from 'react';

//Infinite scroll component
import InfiniteScroll from 'react-infinite-scroll-component';

const withInfiniteScroll = (WrappedComponent) => (props) => {

    const {
        dataLength,
        next,
        hasMore,
        loader,
        endMessage,
        refreshFunction,
        pullDownToRefresh,
        pullDownToRefreshContent,
        releaseToRefreshContent,
        ...rest
    } = props;

    return (

        <InfiniteScroll
            dataLength={dataLength}
            next={next}
            hasMore={hasMore}
            loader={loader}
            endMessage={endMessage}
            refreshFunction={refreshFunction}
            pullDownToRefresh={pullDownToRefresh}
            pullDownToRefreshContent={pullDownToRefreshContent}
            releaseToRefreshContent={releaseToRefreshContent}
        >
            <WrappedComponent {...rest} />
        </InfiniteScroll>
    )
    //return <WrappedComponent {...rest}/>
}

export default withInfiniteScroll;