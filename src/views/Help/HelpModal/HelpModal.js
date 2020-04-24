import React, {Component} from 'react';

//Styles injection
import { withStyles } from "@material-ui/core/styles";
import helpModalStyle from "./HelpModalStyle"

//Custom Components
import Stepper from "../../../components/UI/Stepper/Stepper";
import ZoomModal from "../../../components/UI/Modal/ZoomModal/ZoomModal";

//Material-UI Components
import Button from "@material-ui/core/Button";

// i18n
import {withTranslation} from "react-i18next";

// // Demo object
// const tutorialSteps = [
//     {
//         label: 'San Francisco – Oakland Bay Bridge, United States',
//         imgPath:
//             'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//         label: 'Bird',
//         imgPath:
//             'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//         label: 'Bali, Indonesia',
//         imgPath:
//             'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
//     },
//     {
//         label: 'NeONBRAND Digital Marketing, Las Vegas, United States',
//         imgPath:
//             'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
//     },
//     {
//         label: 'Goč, Serbia',
//         imgPath:
//             'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
//     },
// ];


class HelpModal extends Component {

    state = {
        guideSteps: [],
        open: false
    };

    componentDidMount () {

        let stepsArray = [];
        this.props.tutorialSteps.forEach( (step,index) => {
            stepsArray.push((<img key={index} src={step.imgPath} alt={step.label} width="100%"/>));
        });
        this.setState({guideSteps: stepsArray})
    }

    render() {

        const {
            open,
            handleClose,
            t,
            classes
        } = this.props;

        const { guideSteps } = this.state;

        return (
            <ZoomModal
                open={open}
                title={t('help')}
                buttons={(
                    <Button
                        className={classes.buttons}
                        onClick={handleClose}
                        variant='contained'
                    >
                        {t('Common:close')}
                    </Button>
                )}
                onClose={handleClose}
            >
                <Stepper
                    interval={3000}
                >
                    {guideSteps}
                </Stepper>
            </ZoomModal>
        );
    }
}

export default withTranslation(['HelpModal', 'Common'])(withStyles(helpModalStyle)(HelpModal));