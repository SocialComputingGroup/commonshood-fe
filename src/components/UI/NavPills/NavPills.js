import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from "../../../store/actions";

//Style injections
import withStyles from '@material-ui/core/styles/withStyles';
import navPillsStyle from './NavPillsStyle';

//Material UI Components
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

class NavPills extends Component {


    handleChange = (event, tabIndex) => {
        window.scrollTo(0,0);
        this.props.onIndexChange(tabIndex);
    };

    handleChangeIndex = (tabIndex) => {
        window.scrollTo(0,0);
        this.props.onIndexChange(tabIndex);
    };

    render () {
        const {
            tabs,
            classes,
            theme,
            tabIndex
        } = this.props;

    
        return (
            <React.Fragment>
            {/*<div className={classes.root}>*/}
                <AppBar className={classes.appBar}>
                <Tabs
                    value={tabIndex}
                    onChange={this.handleChange}
                    variant="fullWidth"
                    classes={{
                        indicator: classes.pillsContainer
                    }}
                >
                    {tabs.map((tab, key) => {
                        return (
                            <Tab
                                key={key}
                                className={classes.pill}
                                classes={{selected: classes.pillSelected}}
                                label={tab.tabButton}
                                icon={tab.tabIcon}
                                //onChangeIndex={this.handleChangeIndex}
                            />
                        )
                    })}
                </Tabs>
                </AppBar>


                <SwipeableViews
                    className={classes.pages}
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={tabIndex}
                    onChangeIndex={this.handleChangeIndex}
                    enableMouseEvents
                >
                    {tabs.map((prop, key) => {
                        return ( <React.Fragment key={key}>
                            {tabIndex === key ? prop.tabContent : null}
                        </React.Fragment>)
                    })
                    }
                </SwipeableViews>
                { /* </div> */}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        tabIndex: state.ui.navpillIndex,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIndexChange: (index) => dispatch(actions.handleNavpillIndexChange(index))
    }
};

export default connect(mapStateToProps,mapDispatchToProps) (
                    withStyles(navPillsStyle, { withTheme: true })(NavPills)
                );
