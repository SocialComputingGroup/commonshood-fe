import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux'
import * as actions from '../../../store/actions/index'
import config from '../../../config'

//Jss Style injection
import withStyles from '@material-ui/core/styles/withStyles';
import LogoutStyle from './LogoutStyle';

import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';

//Material Components
import CircularProgress from '@material-ui/core/CircularProgress';

const Typography = asyncComponent(()=>import('@material-ui/core/Typography'));
const Grid = asyncComponent(()=> import ('@material-ui/core/Grid'));

class Logout extends Component {

    authRedirecthandler = () => {
        const net_config = config.network.authserver['firstlife_logout'];

        let urlArray = Object.keys(net_config)
            .map(urlkey => {
                let urlArray = [];
                if (urlkey === 'base_url') {
                    urlArray.push(net_config[urlkey])
                }
                else {
                    urlArray.push(urlkey + '=' + net_config[urlkey])
                }
                return urlArray;
            });
        const token = localStorage.getItem('token');
        //Add token to parameters
        urlArray.push('token=' + token);
        const [first, ...middle]  = urlArray;
        const last = middle.pop();
        const preLast = middle.pop();
        let urlString = first + '?'+ last + '&'
        urlString += middle.reduce (
            (string, el) => {
                return string += el + '&'
            }
            ,'');
        urlString += preLast;
        //Redirect to Firstlife auth
        window.location.replace(encodeURI(urlString));
    }

    componentDidMount() {
    }

    render() {

        const {isAuthenticated, loading, classes } = this.props;

        let loggingOut = (
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.mainContainer}>
                    <Typography variant="subtitle1" className={classes.title}>Logging Out...</Typography>
                    <CircularProgress/>
                </Grid>
            </Grid>

        );


//         if (!loading && isAuthenticated) {
//
//             //verify if the component has been called from redirection
//             const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);
//             if (queryUrlParams.has('logout')) {
//                 const value = queryUrlParams.get('logout')
//                 if (value === 'true') {
//                     this.props.onLogout();
//                 }
//             } else {
//                 this.authRedirecthandler();
//             }
//         } else if (!isAuthenticated) {
//             loggingOut = (<Redirect to="/"/>);
//         }

        if (!loading) {
            if(isAuthenticated){// I Have a valid token
                this.authRedirecthandler();
            } else if (!isAuthenticated) {
                const localToken = localStorage.getItem('token');
                if (localToken) {
                    //Verify if the component has been called from redirection
                    const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);
                    if (queryUrlParams.has('logout')) {
                        const value = queryUrlParams.get('logout');
                        
                        if (value === 'true') {
                            this.props.onLogout();
                        } else {
                            //const message = queryUrlParams.get('message');
                            this.props.onLogout();
                        }
                        localStorage.clear();
                    }
                }
                loggingOut = (<Redirect to="/login" />);
            }
        }

        return loggingOut;
    }
}

const mapStateToProps = state => {
        return {
            loading: state.auth.loading,
            isAuthenticated: state.auth.idToken !== null,
        }
    };

const mapDispatchToProps = dispatch => {
        return {
            onLogout: () => dispatch(actions.logoutFromBackend()),
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(LogoutStyle)(Logout));
//export default Logout