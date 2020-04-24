import React from 'react';
import ZoomModal from '../../../../../../components/UI/Modal/ZoomModal/ZoomModal';
import CircularProgress from "@material-ui/core/CircularProgress";
import AlertAvatar from "../../../../../../components/UI/AlertAvatar/AlertAvatar";
import Button from "@material-ui/core/Button";
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from "react-redux";
import * as actions from "../../../../../../store/actions";
import {withRouter} from "react-router-dom";
import { useTranslation } from 'react-i18next';


const styles = (theme) => ({
    fieldContainer: {
        display: 'flex',
        alignItems:'left',
        margin: theme.spacing(1)
    },
    buttons: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.grey[200],
        margin: theme.spacing(1)
    },
});

const PiggyBankConfirmationModal = (props) => {

    let {
        openModal,
        refunded,
        joined,
        pledgeDifference,
        acceptedCoin,
        classes,
    } = props;

    const { t } = useTranslation('PiggyBankConfirmationModal');

    const handleModalClose = (isError) => {
        const {
            resetJoin,
            resetRefund,
            closeModal,
            closePiggyBank
        } = props;

        closeModal();
        if(!isError) {
            //show again the piggies
            closePiggyBank();
        }

        //no need to check, reset both
        resetJoin();
        resetRefund();
    };

    pledgeDifference = pledgeDifference < 0 ? ( pledgeDifference * -1 ) : pledgeDifference;

    let modalTitle = t('baseTitle');
    let alertText = '', fail=false, success=true, isError=false;

    if(joined === false || refunded === false){//something went wrong
        fail = true;
        success = false;
        isError = true;
        if(joined === false){ //joined failed
            modalTitle = t('joinFailedTitle');
            alertText = t('joinFailedAlert');
        }else{ //refund failed
            modalTitle = t('refundFailedTitle');
            alertText = t('refundFailedAlert');
        }
    }else if(joined === true || refunded === true){
        fail = false;
        success = true;
        isError = false;
        if(joined === true){
            modalTitle = t('joinedSuccessfullyTitle');
            alertText = t('joinedSuccessfullyAlert', {params: {
                ticker: acceptedCoin,
                value: pledgeDifference
            }});
        }else{//refunded
            modalTitle = t('refundedSuccessfullyTitle');
            alertText = t('refundedSuccessfullyAlert', {params: {
                    ticker: acceptedCoin,
                    value: pledgeDifference
                }});
        }
    }

    let creationModalContent;
    let closeModalButton = null;
    if(refunded === undefined && joined === undefined) { //still loading response
        creationModalContent = <CircularProgress/>
    }else {
        creationModalContent = (
            <AlertAvatar big success={success} fail={fail} text={alertText}/>
        );
        closeModalButton = (
            <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={() => handleModalClose(isError)}>
                Ok
            </Button>
        );
    }





    return (
        <ZoomModal
            title={modalTitle}
            //open={refunded !== undefined || joined !== undefined}
            open={openModal} //prop from parent component PiggyBank
            //onClose={() => this.handleCreationModalClose()}
            disableBackdropClick
            disableEscapeKeyDown

        >
            {creationModalContent}
            {closeModalButton}
        </ZoomModal>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        resetJoin: () => dispatch(actions.crowdsaleJoinReset()),
        resetRefund: () => dispatch(actions.crowdsaleRefundReset()),
    }
};

export default withStyles(styles, {withTheme: true})(
    connect(null, mapDispatchToProps)(
        withRouter(
            PiggyBankConfirmationModal
        )
    )
);


