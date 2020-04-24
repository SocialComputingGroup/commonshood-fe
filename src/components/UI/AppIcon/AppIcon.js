import React from 'react';
import propTypes from 'prop-types';

import Icon from '@material-ui/core/Icon'
//Icon Libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import MaterialIcon from './MaterialIcon/MaterialIconAsync';
import MdiIcon from './MdiIcon/MdiIcon';


const appIcon = ({icon, ...props}) => {

    const {font, name} = icon;

    switch(font) {
        case 'mdi':
            return <MdiIcon icon={name} {...props}/>;
        case 'material':
            // return <MaterialIcon icon={name}/>
            return <Icon {...props}>{name}</Icon>;
        case 'fontawesome':
            return <FontAwesomeIcon {...props} use={name}/>;
        default:
            return <Icon {...props}>info</Icon>;
    }
};


appIcon.propTypes = {
    icon: propTypes.object.isRequired,
};

export default appIcon;
