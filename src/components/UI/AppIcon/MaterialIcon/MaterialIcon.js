import React from 'react';
//Case changer
import changeCase from 'change-case';

const materialIcon = ({ icon }) => {

    let iconName = changeCase.pascalCase(icon.replace(/Icon$/, ''));
    let resolved = require(`@material-ui/icons/${iconName}`).default

    if (!resolved) {
        throw Error(`Could not find material-ui-icons/${iconName}`)
    }

    return React.createElement(resolved)
}

export default materialIcon;
