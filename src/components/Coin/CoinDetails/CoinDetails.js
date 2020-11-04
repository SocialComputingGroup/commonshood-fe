import React, {Component} from 'react';

//Redux connector
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

//Routing HOC
import { withRouter } from 'react-router-dom';

//i18n
import {withTranslation} from "react-i18next";

//Lazy loading for Code Splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';

//Style injections
import { withStyles } from "@material-ui/core/styles";
import coinDetailsStyle from "./CoinDetailsStyle";
import List from "@material-ui/core/List";


//Custom Components
import CoinMinter from "./CoinMinter/CoinMinter";

//Material-UI Components (Lazy loaded)
const Grid = asyncComponent(()=> import("@material-ui/core/Grid"));
const Avatar = asyncComponent(()=> import("@material-ui/core/Avatar"));
const Typography = asyncComponent(()=> import("@material-ui/core/Typography"));
const Button = asyncComponent(()=> import("@material-ui/core/Button"));
const TransactionListItem = asyncComponent(()=> import ("../../Transactions/TransactionListItem/TransactionListItem"));
const Divider = asyncComponent(()=> import("@material-ui/core/Divider"));

class CoinDetails extends Component  {

    state = {
        showCoinMinter: false,
        showConfirmationMessage: false,
    };

    componentDidMount() {
        this.props.onTransactionsGetList(this.props.children.symbol, this.props.children.decimals);
    }

    handlePay = () => {
        const ticker = this.props.children.symbol;
        const icon = this.props.iconData;
        const type = this.props.children.type; //token or goods
        const address = this.props.children.address;
        this.props.onSetPreselectedCoin({ticker, icon, type, address});
        this.props.handleClose(); //close this modal
        this.props.onBottomMenuIndexChange(0); //bring user back to coinSend
    };

    handleShowCoinMinter = (mintSubmitted) => {
        const currentShowCoinMinter = this.state.showCoinMinter;
        this.setState({
            showCoinMinter: !currentShowCoinMinter,
            showConfirmationMessage: mintSubmitted ? mintSubmitted : false,
        });
    };


    render () {
        const {
            classes,
            profileId,
            children,
            iconData,
            userName,
            downloadContract,
            transactionsList,
            t,
            web3account
        } = this.props;

        const isOwned = web3account === children.addressOfOwner;

        const ownerString = isOwned ? t('owned') : t('createdBy')+" "+ userName;
        //const cap = isOwned ? t('cap')+" "+children.cap : null;
        const balance = children.balance;

        let localTransactionList = [];
        if(transactionsList == null){
            localTransactionList = null;
        }else{
            transactionsList.reverse().forEach((item,index) => {
                if (item.from.id !== -1){
                    localTransactionList.push(
                        <TransactionListItem
                            name={item.to.id === profileId ? item.from.fullname : item.to.fullname}
                            timestamp={item.timestamp}
                            amount={item.value}
                            way={item.to.id === profileId ? "in" : "out"}
                            key={index}
                        />
                    );
                }
            });
        }

        const coinMinterButton = isOwned ?
            (<Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => this.handleShowCoinMinter()}
                    disabled={this.state.showConfirmationMessage}>
                    {this.state.showCoinMinter ? t('coinMintUndo') : t('coinMint')}
                </Button>
            </Grid>)
            : null;

        const coinPayButton = (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={this.handlePay} disabled={parseFloat(balance) === 0}>
                    {t('Common:pay')}
                </Button>
            </Grid>
        );

        const donwloadManifestButton = (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={downloadContract}>
                    {t('manifestDownload')}
                </Button>
            </Grid>
        );

        return (
            <Grid container style={{marginTop: '1em'}}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={6} align="center">
                            {iconData ?
                                <Avatar
                                    alt={children.symbol}
                                    src={iconData}
                                    className={classes.avatar}
                                /> :
                                <Avatar
                                    className={classes.avatar}
                                    alt={children.symbol}
                                >{children.symbol}
                                </Avatar>
                            }
                        </Grid>
                        <Grid item xs={6} align="center">
                            <Typography variant="subtitle2" color={ parseFloat(balance) === 0 ? "error" : "initial"}>
                                {t('balance')} {children.balance}
                            </Typography>
                            <Typography variant="subtitle2">
                                {ownerString}
                            </Typography>
                            {/* {cap ?
                                <Typography variant="subtitle2">
                                    {cap}
                                </Typography>
                                : null
                            } */}
                        </Grid>


                        <Grid item xs={12}>
                            <Typography paragraph={true} align="center">
                                {children.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justify="center" spacing={1}>

                                {coinMinterButton}

                                {this.state.showCoinMinter ?
                                    <Grid item xs={12} align="center">
                                        <CoinMinter
                                            tokenAddress={this.props.children.address}
                                            ticker={this.props.children.symbol}
                                            decimals={this.props.children.decimals}
                                            icon={this.props.iconData}
                                            coinType={this.props.children.type}
                                            onMintSubmit={this.handleShowCoinMinter}
                                        />
                                    </Grid>
                                : null}

                                {this.state.showConfirmationMessage ?
                                    <Grid item xs={12} align="center">
                                        <Typography variant="caption" color="secondary" display="block" style={{marginTop: '3em', paddingLeft: '2em', paddingRight: '2em'}} >
                                            Mint confirmed, wait confirmation in notification
                                        </Typography>
                                    </Grid>
                                : null}

                                {this.state.showCoinMinter ? null : coinPayButton}

                                {this.state.showCoinMinter ? null : donwloadManifestButton}

                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider style={{marginTop: 15}}/>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography variant="subtitle1" style={{marginTop: 15}}>{t('transactionsHistory')}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <List>{localTransactionList}</List>
                        </Grid>
                    </Grid>


                </Grid>
            </Grid>
        );

    }

}

const mapStateToProps = state => {
  return {
        web3account: state.web3.currentAccount,
        transactionLoading: state.coin.loadingTransactions,
        transactionsList: state.coin.transactions,
        profileId: state.user.currentProfile.id    
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onTransactionsGetList: (symbol, decimals) => dispatch(actions.coinTransactions(symbol, decimals)),
        onSetPreselectedCoin: (coin) => dispatch(actions.coinSetPreselected(coin)),
        onBottomMenuIndexChange: (index) => dispatch(actions.handleBottomMenuIndexChange(index)),
    }
};

export default withStyles(coinDetailsStyle, {withTheme:true})(
    connect(mapStateToProps,mapDispatchToProps)(
        withTranslation(['CoinDetails', 'Common'])(
            withRouter(CoinDetails)
        )
    )
  );


