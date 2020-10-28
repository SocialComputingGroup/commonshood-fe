import React, {Component} from 'react';

import io from 'socket.io-client';

import {logger} from './utilities/winstonLogging/winstonInit';


//Redux connector
import { connect } from 'react-redux';
import * as actions from "./store/actions";

//Routing system
import {
    Route,
    Switch,
    Redirect,
    withRouter } from "react-router-dom";

// import routes
import indexRoutes from './routes/index'

//Custom components
import Layout from './hoc/Layout/Layout';

//Global app config
import mainConfig from './config/mainConfig'
import config from './config';

//Auth flow components
import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout';
import MetamaskHelper from './views/MetamaskHelper/MetamaskHelper';
//import socket from "./utilities/backend/socketio-helper";

// Global socket connection
let socket;

class App extends Component {

    state = {
        hasCheckedMetamask: false,
    };

    componentDidMount(){
        const {
            isAuthenticated,
            onWeb3CheckMetamask
        } = this.props;

        if(
            isAuthenticated 
        ) {
            onWeb3CheckMetamask();
            this.setState({
                hasCheckedMetamask: true,
            });
        }
    }

    componentDidUpdate () {
        const {
            isAuthenticated,
            unreadNotificationsLoaded,
            unreadNotificationsLoading,

            onWeb3CheckAndSubscribeMetamask,
            web3Instance,

            notificationWeb3Listening,
        } = this.props;

        if( isAuthenticated ) {
            if( !notificationWeb3Listening && this.state.hasCheckedMetamask == false && web3Instance == null){
                onWeb3CheckAndSubscribeMetamask();
                this.setState({
                    hasCheckedMetamask: true,
                });
            }

            if(!unreadNotificationsLoading && !unreadNotificationsLoaded){
                this.props.onLoadUnreadNotifications();
            }
        }
    }

    render() {
        const {
            isAuthenticated,
            loading,
            web3Instance,
            isMetamaskChecking,
        } = this.props;

        let routes = null;

        if( isAuthenticated && 
            web3Instance == null && 
            isMetamaskChecking == false && 
            this.state.hasCheckedMetamask == true){
            logger.info("metamask helper page");
            routes = (
                <Switch>
                    <Route path='/metamaskHelper' component={MetamaskHelper} />
                    <Redirect key={0} from='/' to='/metamaskHelper'/>
                </Switch>
            )
        }else if (isAuthenticated) {

            let routesArray = indexRoutes.map((route, key) => {
                const Component = route.component;
                return (<Route
                    key={key}
                    exact={route.exact}
                    path={route.path}
                    render={
                        () => {
                            if (route.path !== '/logout') {
                                return (
                                    <Layout title={mainConfig.basic.appName}>
                                        <Component/>
                                    </Layout>

                                )
                            } else {
                                return (<Component/>)
                            }
                        }
                    }
                />)
            });
            //routesArray.push(<Redirect key={routesArray.length} to='/?help=true' />);
            routesArray.push(<Redirect key={routesArray.length} to='/' />);
            //history.replace('/');

            routes = (
                <Switch>
                    {routesArray}
                </Switch>);


        } else { // NOT AUTHENTICATED
            routes = (
                 <Switch>
                    <Route path='/login' component={Auth} />
                    <Route path='/logout' component={Logout} />
                    {!loading ? <Redirect from='/' to='/login'/> : null}
                    {/* {!loading ? history.replace('/login') : null}*/}
                 </Switch>
            )
        }

        return (
            <Switch>
                {routes}
            </Switch>
        );
            //<JssProvider jss={jss} >
            // </JssProvider>
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        isAuthenticated: state.auth.idToken !== null,
        notificationSocketAuthenticating: state.notification.notificationSocketAuthenticating,
        notificationSocketAuthenticated: state.notification.notificationSocketAuthenticated,
        notificationWeb3Listening: state.notification.notificationWeb3Listening,
        unreadNotificationsLoaded: state.notification.unreadNotificationsLoaded,
        unreadNotificationsLoading: state.notification.unreadNotificationsLoading,
        web3Instance: state.web3.web3Instance,
        isMetamaskInstalled: state.web3.isMetamaskInstalled,
        isMetamaskChecking: state.web3.isMetamaskChecking,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCheckAuth: () => dispatch( actions.checkAuthOnClient()),
        onAuthFromServer: (type, data) => dispatch( actions.checkAuthOnServer(type,data) ),
        onAuthError: (error) => dispatch (actions.authFail(error)),
        onSocketAuth: (socket) => dispatch(actions.notificationSocketAuthentication(socket)),
        onNotificationSocketListenMessages: (socket) => dispatch(actions.notificationListenToSocket(socket)),
        onLoadUnreadNotifications: () => dispatch(actions.notificationGetAllMineUnread()),
        onWeb3CheckMetamask: () => dispatch(actions.web3CheckMetamaskPresence(false)),
        onWeb3CheckAndSubscribeMetamask: () => dispatch(actions.web3CheckMetamaskPresence(true)),
    }
};

export default withRouter( connect(mapStateToProps,mapDispatchToProps) (App));
