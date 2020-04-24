import React from 'react';

//i18n
import {useTranslation} from "react-i18next";

//Material UI Components
import Button from '@material-ui/core/Button'

//Fake instructions
import lorem from 'lorem-ipsum';

//Style import
import withStyles from '@material-ui/core/styles/withStyles';
import InstructionStyle from './InstructionStyle';

import ZoomModal from '../../../../components/UI/Modal/ZoomModal/ZoomModal';

const Instruction = ({
    classes,
    onClose,
    ...other
}) => {
    const { t, i18n} = useTranslation('Common');
    return (
       <ZoomModal
           title={t('instructions')}
           buttons={(
                   <Button
                       className={classes.buttons}
                       onClick={onClose}
                       variant='contained'
                   >
                       {t('close')}
                   </Button>)}
           onClose={onClose}
           {...other}
       >
           {lorem({count: 5})}
       </ZoomModal>
   )
};

export default withStyles(InstructionStyle)(Instruction);