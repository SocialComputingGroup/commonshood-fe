import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {logger} from '../../../utilities/winstonLogging/winstonInit';

//Redux actions connector
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

//helper for profile comparision
import {isProfileChanged} from '../../../utilities/utilities';

//Style injection
import withStyles from '@material-ui/core/styles/withStyles';
import MyWalletStyle from './MyWalletStyle';

//Material UI components
import Button from '@material-ui/core/Button';

//Async code splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';

//Material UI Components
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';

//i18n
import {withTranslation} from "react-i18next";
import {Tabs, Tab} from "@material-ui/core";

//Assets
import {assetsType} from '../../../config/assets';

//Custom Components
const CoinList = asyncComponent(()=>import("../../../components/Coin/CoinList/CoinList"));
const SlideModal = asyncComponent(()=>import('../../../components/UI/Modal/SlideModal/SlideModal'));
const Loading = asyncComponent(()=>import('../../../components/UI/Loading/Loading'));
const SplashScreen = asyncComponent (()=> import ('../../../components/UI/SplashScreen/SplashScreen'));

const MyWalletDetails = asyncComponent( () =>import('./MyWalletDetails/MyWalletDetails'));

class MyWallet extends Component {

    state = {
        coinModalOpened: false,
        //searchInput: '',
        sortKey: 0,
        filterKey: '*',
        profile: null,
        assetType: assetsType.token.name,
    };


    //Redirect to coin creation in case there's no coin in wallet
    handleCreateButton = () => {
        this.props.history.push('/coinCreate?firstTime');
    }

    //Filter between Assets
    handleFilter = (event,value) => {
        const {onCoinGetList, onCoinGetListReset, profile} = this.props;
        this.setState({assetType: assetsType[value].name, iconDataLoaded: false });
        onCoinGetListReset();
        onCoinGetList(assetsType[value].name, false, true);
    };


    // Opens Coin Detail
    coinDetailOpen = (symbol) => {
        const currentCoin = this.props.coinList.find(item => item.symbol === symbol);
        this.setState({
             selectedCoin: currentCoin,
             coinModalOpened: true
        });
    };

    //Close Coin Detail
    coinDetailClose = () => this.setState({
        selectedCoin: null,
        coinModalOpened: false
    });

    componentDidMount() {
        //Store current profile
        const {profile} = this.props;
        if (profile) {
            this.setState({profile: {...profile}})
        }

        if (!this.state.localCoinList && !this.props.coinLoading) {
            //first time type is the most left asset
            this.props.onCoinGetList(assetsType[this.state.assetType].name, false, true);
        }

        // const coinList = [...new Array(3)].map(() => this.coinBuild());
        // this.setState({localCoinList: coinList})


    }

    componentDidUpdate (prevProps, prevState) {
        const {
            coinLoading,
            coinList,
            profile,
            onCoinGetList,
            onCoinGetListReset,
        } = this.props;

        // has the user switched profile?
        if( (prevProps.profile !== null ) && (profile !== null) && isProfileChanged(prevProps.profile, profile)){
            logger.info('[MYWALLET = PROFILE UPDATED]');
            this.setState({
                localCoinList: null,
            });
            onCoinGetListReset();
        } else{ //no recent switch of profile
            if(!coinLoading && (coinList == null) ){
                logger.info('[MYWALLET = COIN LIST EMPTY] => ', coinList);
                onCoinGetList(assetsType[this.state.assetType].name, false, true);
            }else{
                logger.info('[MYWALLET = COIN LIST ALREADY FILLED => ', coinList);
            }
        }

        // if(prevProps.tickersInWallet.length !== this.props.tickersInWallet.length){
        //     this.setState({
        //         localCoinList: null,
        //     });
        //     onCoinGetListReset();
        //     onCoinGetList(assetsType[this.state.assetType].name, false, true);
        // }
    }


    render() {
        const {
            selectedCoin,
            coinModalOpened,
        } = this.state;

        const {
            classes,
            t, //i18n via HOC
            coinLoading,
            coinList,
        } = this.props;

        let walletRender = (<Loading withLoader title={t('waitCoinLoad') + "..."} />);
        let walletFilter = (
            <Tabs
                value={this.state.assetType}
                onChange={this.handleFilter}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
            >
                <Tab
                    key={assetsType.token.id}
                    value={assetsType.token.name}
                    label={t(assetsType.token.name)}
                    icon={assetsType.token.icon}
                    disabled={coinLoading && (assetsType.token.id !== this.state.assetType)}
                />
                <Tab
                    key={assetsType.goods.id}
                    value={assetsType.goods.name}
                    label={t(assetsType.goods.name)}
                    icon={assetsType.goods.icon}
                    disabled={coinLoading && (assetsType.goods.id !== this.state.assetType)}
                />
            </Tabs>
        );

        logger.info('[COIN LIST] redux =>', coinList);
        if (coinList && coinList.length !== 0) {

            walletRender = (
                <>

                    {/* FIXME - SEARCH REMOVED TEMPORARILY
                        <SearchField
                        placeholder= {t('searchFieldPlaceholder')}
                        searchHandler={(event) => this.updateSearchInput(event.target.value)}
                        value={searchInput}
                    />*/}
                    <Divider/>
                    <CoinList
                        coinList={coinList}
                        handleSelect={this.coinDetailOpen}
                        showPayButton={true}
                    />

                    {selectedCoin  ?
                        <SlideModal
                            open={coinModalOpened}
                            handleClose={this.coinDetailClose}
                            title={selectedCoin !== null ? `${selectedCoin.name} | ${t('modalTitleDetails')}` : null}
                        >
                            <MyWalletDetails
                                selectedCoin={selectedCoin}
                                handleClose={this.coinDetailClose}
                                //iconData={coinList.logoFile}
                            />
                        </SlideModal>
                        : null}
                </>
            );
            

        } else if (coinList && coinList.length === 0) {
            const createButtonText = this.state.assetType === assetsType.token.name ? t('createNewCoin') : t('createNewCoupon');
            const titleText = this.state.assetType === assetsType.token.name ? t('noCoinsTitle') : t('noCouponsTitle');
            walletRender = (
                <SplashScreen title={titleText} avatarProps={{'big': true, 'warning': true}}>
                    <div>{t('createQuestion')}</div>
                    <div>
                    <Button className={classes.buttons} variant='contained' onClick={this.handleCreateButton}>{createButtonText}</Button>
                    </div>
                </SplashScreen>)
        }

        return (
            <>
                {walletFilter}
                {walletRender}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        coinLoading: state.coin.loading,
        coinList: state.coin.coinList,
        profile: state.user.currentProfile,
        //tickersInWallet: [...state.user.currentProfile.coins], //this is used to check if we added never-owned-before coin in the wallet after a notification
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCoinGetList: (type,withBalance,profileCoins) => dispatch (actions.coinGetList(type, withBalance, profileCoins, false)),
        onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
    }
};

MyWallet.propTypes = {};

export default connect(mapStateToProps,mapDispatchToProps) (
                    withRouter(
                        withStyles(MyWalletStyle) (
                            withTranslation('MyWallet') (MyWallet)
                        )
                    )
                );
