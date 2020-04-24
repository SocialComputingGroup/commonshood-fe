import React from 'react';

import Avatar from '@material-ui/core/Avatar';
//import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

//Place placeholder
import place_placeholder from '../../../../assets/img/home-green.png'
const contactSelectDetails = ({contact, iconData, showEmail}) => {
    let details = (<div>Loading...</div>);
    if (contact) {
        const {
            name,
            email
        } = contact;

        let emailField = null;
        if(showEmail && email){
            emailField = <Typography variant="caption" display="block">{email}</Typography>;
        }
        details = (
            <>
                {iconData && iconData !== "data:application/octet-stream;base64," ? (
                    <Avatar alt={name} src={iconData} />
                ) : (
                    <Avatar alt={name} src={place_placeholder} />
                )}
                {<span>&nbsp;</span>}
                <Typography variant="inherit" >{name}</Typography>
                {<span>&nbsp;</span>}
                {emailField}
            </>
        )
    }
    return details;
};

export default contactSelectDetails;