import Layout from '../Layout/Layout'

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
                                 component: Component,
                                 isAuthenticated: auth,
                                 title,
                                 ...rest }) =>
{
    return (
    <Route {...rest}
           render={
               props => {
               return (
                   auth
                       ? <Layout title={title}><Component {...rest} /></Layout>
                       : <Redirect to="/login" />)
               }
           }
    />)
};
