import React, {Component} from 'react';
import {withTranslation} from "react-i18next";

//notification configuration
import config from '../../config/notificationConfig'

//Faker lists
import faker from 'faker';

//Material UI theming
import withStyles from '@material-ui/core/styles/withStyles'
import mockComponentStyle from './MockComponentStyle'

//Basic containers
//import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

//Test custom component
import ScrollingList from '../../components/UI/ScrollingList/ScrollingList';
import Loading from '../../components/UI/Loading/Loading';
import MiniLoader from '../../components/UI/Loading/MiniLoader';

class MockComponent extends Component {

    state = {
        msgPageLength: 20,
        msgList: null,
        hasMore: true
    };

    chooseRandomMsgIcon = () => {
        const msgTypes = config.categories;
        let keys = Object.keys(msgTypes);
        const index =  keys.length * Math.random() << 0;
        return {
            name: keys[index],
            icon: msgTypes[keys[index]]
        };
    }


    listFakeFetch = () => {
        const fakerList = [];
        for (let i=0; i < this.state.msgPageLength; i++) {
            const randomCategory = this.chooseRandomMsgIcon();
            fakerList.push( {
                id: faker.random.uuid(),
                category: randomCategory.name,
                summary: faker.lorem.sentence(),
                body: faker.lorem.sentence(),
                icon: randomCategory.icon,
                itemSelected: false
            })
        }
        return fakerList;
    };

    listLoadMore = () => {
        setTimeout( () => {
            this.setState({
                msgList: this.state.msgList.concat(this.listFakeFetch()),
            })
        },1500)
    };

    componentDidMount () {
        if (!this.state.msgList) {
            this.setState({msgList: this.listFakeFetch()});
        }
    }

    simpleMenuOpenHandler = (event) => this.setState({anchorEl: event.currentTarget});
    simpleMenuCloseHandler = () => this.setState({anchorEl: null});

    render() {
        const {msgList, hasMore } = this.state;
        const {t} = this.props;

        let render = (<Loading withLoader title={t('waitMessageLoad')} />);
        if (msgList && msgList.length !== 0) {

            render=(
                <ScrollingList
                    dataLength={msgList.length}
                    next={this.listLoadMore}
                    hasMore={hasMore}
                    loader={
                        <MiniLoader/>}
                    pullDownRefreshContent
                >
               {
                   msgList.map((item,index) => {
                       return (
                           <ListItem key={index}>
                               <ListItemIcon>{item.icon}</ListItemIcon>
                               <ListItemText primary={item.body} secondary={item.category} />
                           </ListItem>
                       )
                   })
               }
            </ScrollingList>)
        }
        return render;
    }
}

MockComponent.propTypes = {};

export default withStyles(mockComponentStyle)(
                    withTranslation('Common') (MockComponent)
                );
