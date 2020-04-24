import React from 'react';
import { asyncComponent } from 'react-async-component'

//Case changer
import changeCase from 'change-case';

const materialIconAsync = ({ icon }) => {

    let iconName = changeCase.pascalCase(icon.replace(/Icon$/, ''))
    return React.createElement(asyncComponent({
        resolve: () => import(
            /* webpackMode: "eager" */
            `@material-ui/icons/${iconName}`)
    }))
}

export default materialIconAsync;