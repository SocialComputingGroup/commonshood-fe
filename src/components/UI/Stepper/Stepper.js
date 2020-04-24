import React, {Component} from 'react';

//Material-UI Components
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

//Material Styling
import {withStyles} from "@material-ui/core/styles";
import stepperStyle from "./StepperStyle";

//i18n
import {withTranslation} from "react-i18next";


//Inject Autoplay as HOC
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

class Stepper extends Component {
    state = {
        activeStep: 0
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
            autoPlay: true
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
            autoPlay: true
        }));
    };

    handleStepChange = activeStep => {
        this.setState({ activeStep });
    };

    handleAutoPlay = () => {
        this.setState({autoPlay: false})
    };


    render() {

        const { activeStep, autoPlay } = this.state;

        const {
            children,
            t,
            classes
        } = this.props;

        const maxSteps = children.length;

        return (
            <>
                <AutoPlaySwipeableViews
                    autoPlay={autoPlay}
                    index={activeStep}
                    onChangeIndex={this.handleStepChange}
                    enableMouseEvents
                >
                    {
                        children.length !== 0 ?
                            children.map((step, index) => {
                                return (
                                    <div key={index} onClick={this.handleAutoPlay}>
                                        {Math.abs(activeStep - index) <= 2 ? step : null}
                                    </div>
                                )
                            })
                            : null
                    }
                </AutoPlaySwipeableViews>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                            {t('next')}
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />
                            {t('back')}
                        </Button>
                    }
                />
            </>
        );
    }
}

export default withStyles(stepperStyle)(withTranslation('Common')(Stepper));