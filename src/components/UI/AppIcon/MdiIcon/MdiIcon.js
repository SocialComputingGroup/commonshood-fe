import React from 'react';
//Case changer
import changeCase from 'change-case';

const mdiIcon = ({ icon }) => {

    let iconName = changeCase.pascalCase(icon.replace(/Icon$/, ''));
    let resolved = require(`mdi-material-ui/${iconName}`).default;

    if (!resolved) {
        throw Error(`Could not find mdi-material-ui/${iconName}`)
    }

    return React.createElement(resolved)
}

export default mdiIcon;