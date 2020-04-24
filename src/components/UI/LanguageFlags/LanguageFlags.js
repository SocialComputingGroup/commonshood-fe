import React from 'react';
//import {useTranslation} from "react-i18next";

import FlagButton from './FlagButton/FlagButton';

//import asyncComponent from "../../../hoc/AsyncComponent/AsyncComponent";
import Grid from '@material-ui/core/Grid';

// const ListItem = asyncComponent(()=>import('@material-ui/core/ListItem'));
// const ListItemIcon = asyncComponent(()=>import('@material-ui/core/ListItemIcon'));
//const ListItemText = asyncComponent(()=>import('@material-ui/core/ListItemText'));



const LanguageFlags = (props) =>{
    let supportedLanguagesISO = [
        ['it', 'it-IT'],
        ['gb', 'en-US']
    ];

    let languageButtons = supportedLanguagesISO.map( (lng) => {
        return (
            <Grid item key={lng[0]}>
                <FlagButton countryAcronym={lng[0]} lngISO={lng[1]} i18n={props.i18n}/>
            </Grid>
        );
    });

    return (
        <Grid container direction="row" alignItems="center" justify="center">
            {languageButtons}
        </Grid>
    );


};

export default LanguageFlags;