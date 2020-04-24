import React from 'react';
import { asyncComponent } from 'react-async-component'

//Case changer
import changeCase from 'change-case';

const mdiIconAsync = ({ icon }) => {

    let iconName = changeCase.pascalCase(icon) + 'Icon';
    return React.createElement(asyncComponent({
        resolve: () => import(
            /* webpackMode: "eager" */
            `mdi-react/${iconName}`)
    }))
}

export default mdiIconAsync;