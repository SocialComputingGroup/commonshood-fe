import React, {useState} from 'react';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
//import {withRouter} from "react-router-dom";
import SlideModal from "../Modal/SlideModal/SlideModal";
import Qr from '../../Qr/Qr';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';



const styles = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        right: '20px',
        bottom: '80px',
        position: 'fixed',
    },
});

const QrFab = (props) => {
    const {
        classes, //withStyles
    } = props;

    const [isOpenModal, changeOpenModal] = useState(false);

    const handleClick = () => {
        changeOpenModal(!isOpenModal);
    };

    if(!isOpenModal) {
        return (
            <Fab size="medium" color="primary" className={classes.fab} onClick={handleClick}>
                <FontAwesomeIcon icon="qrcode" size="2x"/>
            </Fab>
        );
    }else{
        return(
            <SlideModal
                open={isOpenModal}
                handleClose={handleClick}
                title="Qr Code"
                position= "absolute"
            >
                <Qr closeParentModal={handleClick}/>
            </SlideModal>
        )
    }
};

export default  withStyles(styles)(QrFab);