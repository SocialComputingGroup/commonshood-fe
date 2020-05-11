import React, {useEffect, useState} from 'react';
import {withRouter} from "react-router-dom";

import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import {withStyles} from "@material-ui/core";
import BottomMenuBarStyle from "./BottomMenuBarStyle";

import { useTranslation } from 'react-i18next';


import {getMenuElements} from './menuConfig';
import * as actions from "../../store/actions";
import {connect} from "react-redux";
import QrFab from "../UI/QrFab/QrFab";

const BottomMenuBar = (props) => {
    const {
        classes,
        onIndexChange,
        tabIndex
    } = props;

    const { t } = useTranslation('Common');

    let bottomNavigationActions = Object.values(getMenuElements(t)).map( (elem, index) => {
        return (
            <BottomNavigationAction
                className={classes.buttonStyle}
                label={elem.text}
                icon={elem.icon}
                key={elem.text}
            />
        )
    });

    //this menu should be showed ONLY in home route (= '/', see Layout.js )
    if(props.location.pathname !== '/'){
        return null;
    }else {
        return (
            <>
                {/* <QrFab/> */}
                <BottomNavigation
                    value={tabIndex}
                    onChange={(event, value) => {
                        onIndexChange(value)
                    }}
                    showLabels
                    className={classes.stickToBottom}
                >
                    {bottomNavigationActions}
                </BottomNavigation>
            </>
        );
    }
};


const mapStateToProps = state => {
    return {
        tabIndex: state.ui.bottomMenuActiveIndex,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIndexChange: (index) => dispatch(actions.handleBottomMenuIndexChange(index))
    }
};

export default connect(mapStateToProps,mapDispatchToProps) (
    withStyles(BottomMenuBarStyle, {withTheme:true})(
        withRouter(BottomMenuBar)
    )
);
