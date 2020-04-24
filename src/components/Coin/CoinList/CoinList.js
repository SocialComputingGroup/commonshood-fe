import React from 'react';
import {logger} from '../../../utilities/winstonLogging/winstonInit';

//Lazy loading for Code Splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';
// Custom Component
import CoinListItem from './CoinListItem/CoinListItem'

//Material-UI Components (Lazy loaded)
const Grid = asyncComponent(()=> import("@material-ui/core/Grid"));
const List = asyncComponent(()=> import("@material-ui/core/List"));

const CoinList = (props) => {
    const {
        coinList,
        selectedCoin,
        handleSelect,
        withRadio,
        id,
    } = props;

    logger.debug('[COIN LIST] selected coin index =>', selectedCoin);

    const orderedList = coinList.sort( (a,b) => a.name.localeCompare(b.name));

    return (
        <Grid container style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Grid item xs={12}>
                <List dense style={{marginBottom: '50px'}}>
                    {
                        orderedList.map((coin, index) => {

                            const selected = selectedCoin === index;

                            return (
                                <CoinListItem
                                    handleSelect={handleSelect}
                                    //handleBalance={handleBalance}
                                    showPayButton={props.showPayButton}
                                    coin={coin}
                                    key={index}
                                    id={id}
                                    selected={selected}
                                    withRadio={withRadio}
                                />
                            )
                        })}
                </List>
            </Grid>
        </Grid>
    );
};

export default CoinList;
