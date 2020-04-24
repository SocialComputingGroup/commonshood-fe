import React, {Component} from 'react';
import {logger} from '../../utilities/winstonLogging/winstonInit';
//import PropTypes from 'prop-types';

//i18n
import {withTranslation} from "react-i18next";

//Redux connector
import { connect } from 'react-redux';

//Redux Actions
import * as actions from '../../store/actions/index'

//Main configuration
import config from '../../config';

//Router redirection
import {
    withRouter
} from 'react-router-dom';

//Material UI Styling
import withStyles from '@material-ui/core/styles/withStyles';
import AuthStyle from './AuthStyle';

// import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

// Material UI components
import Typography from '@material-ui/core/Typography';
// const CircularProgress = asyncComponent(()=>import('@material-ui/core/CircularProgress'));
// const Grid = asyncComponent(()=>import('@material-ui/core/Grid'));

class Auth extends Component {

    // Redirect to authentication
    authRedirecthandler = (network) => {
        //event.preventDefault();
        const net_config = config.network.authserver[network];

        let urlArray = Object.keys ( net_config )
            .map( urlkey => {
                let urlArray = [];
                if (urlkey === 'base_url') {
                    urlArray.push(net_config[urlkey])
                } else if (urlkey === 'scope') {
                    urlArray.push(urlkey + '=' + net_config[urlkey].join(' '));
                }
                else {
                    urlArray.push(urlkey + '=' + net_config[urlkey])
                }
                return urlArray;
            });
        const [first, ...middle]  = urlArray;
        const last = middle.pop();
        let urlString = first + '?';
        urlString += middle.reduce (
            (string, el) => {
                return string += el + '&'
            }
            ,'');
        urlString += last;
        logger.debug('AuthRedirectHandler urlstring => ', urlString);
        //Redirect to Firstlife auth
        window.location.replace(encodeURI(urlString));
        //window.location = encodeURI(urlString);

    };

    render() {
        const {
            t, //i18n from withTranslation HOC
            classes,
            isAuthenticated,
            loading,
            onCheckAuth,
            onAuthFromServer
        } = this.props;

        let redirectText = t('redirectAuth');
        let authRender = (
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.mainContainer}>
                    <Typography variant="subtitle2" className={classes.title}>{redirectText}</Typography>
                    <CircularProgress/>
                </Grid>
            </Grid>
        );

        // if (isAuthenticated) {
        //     authRender = (<Redirect to='/'/>)
        // }

        // Not in redux auth flow
        if (!loading) {
            if (isAuthenticated) {

                redirectText = t('enteringApp');
            } else {

                const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);
                // Check if there is an Authorization code from the query params
                let type = null;
                if (queryUrlParams.has('code')) {
                    type = 'code';
                }

                if (queryUrlParams.has('token')) {
                    type = 'token';
                }

                if (type) {
                    const data = queryUrlParams.get(type);
                    onAuthFromServer(type, data);
                } else {
                    //I could have a valid token already, but not in Store
                    const localToken = localStorage.getItem('token');
                    if (localToken) { //Check if token is valid
                        onCheckAuth();
                    } else { // no token, call oauth server
                        redirectText = t('redirectLogin');
                        // User is not authenticated and has to be redirected to login
                        this.authRedirecthandler('firstlife');
                    }
                }

                // const redirectText = loading ? 'Waiting for Authentication...' : 'Redirect to Login...';
                //
                // // User is not authenticated and has to be redirected to login
                // authRender = (
                //     <Grid container spacing={16}>
                //         <Grid item xs={12} className={classes.mainContainer}>
                //             <Typography variant="subtitle1" className={classes.title}>{redirectText}</Typography>
                //             <CircularProgress/>
                //             { !loading ? this.authRedirecthandler('firstlife') : null }
                //         </Grid>
                //     </Grid>
                // );
            }

        }
        return (authRender);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        authCode: state.auth.authCode,
        isAuthenticated: state.auth.idToken !== null,
        //socketAuthenticated: state.socket.socketAuthenticated,
        //authRedirectPath: state.auth.authRedirectPath,
        userData: state.user.user
    }
};

const mapDispatchToProps = dispatch => {
    return {

        onCheckAuth: () => dispatch(actions.checkAuthOnClient()),
        onAuthFromServer: (type, data) => dispatch( actions.checkAuthOnServer(type,data) ),
        //onSetAuthRedirectPath: () => dispatch( actions.setAuthRedirectPath('/')),
        //onAuthTokenSuccess: (token, userData) => dispatch (actions.authSuccess(token)),
        onAuthError: (error) => dispatch (actions.authFail(error))
    }
};

Auth.propTypes = {};

export default withTranslation('Auth')(
                    withRouter(
                        withStyles(AuthStyle) ( connect(mapStateToProps,mapDispatchToProps) (Auth) )
                    )
                );
