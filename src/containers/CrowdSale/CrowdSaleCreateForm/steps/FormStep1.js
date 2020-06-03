import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";


const useStyles = makeStyles( (theme) => {
    return createStyles({
        textFields: {
            margin: "10px 5px 10px 5px",
        },
        select:{
            margin: "10px 5px 10px 5px",
            minWidth: "200px",
        }
    });
});

const FormStep1 = (props) => {
    const {
        formik,
        setStep,
        ownedCoupons
    } = props;

    const classes = useStyles();
    const { t } = useTranslation('CrowdSaleCreateForm');

    const [selectedEmittedCoin, setSelectedEmittedCoin] = useState(formik.values[formFieldsNames.indexEmittedCoin]); 
    const minimumTotalEmittedCoin = 1;
    const [totalEmittedCoin, setTotalEmittedCoin] = useState(formik.values[formFieldsNames.totalEmittedCoin]);

    useEffect( () => {
        if(formik.values[formFieldsNames.emittedCoin].address != ownedCoupons[selectedEmittedCoin].address ){
            formik.setFieldValue(formFieldsNames.emittedCoin, ownedCoupons[selectedEmittedCoin]); //initialize correctly
        }
    }, [ownedCoupons, formik]);

    const handleEmittedCoinSelect = (event) => {
        formik.setFieldValue(formFieldsNames.emittedCoin, ownedCoupons[event.target.value]);
        formik.setFieldValue(formFieldsNames.indexEmittedCoin, event.target.value);
        setSelectedEmittedCoin(event.target.value);
    };

    return (
        <Grid 
            container 
            justify='center' 
            alignItems='flex-start' 
            item xs={12}
            style={{marginTop: "20px"}}
            >
            <Grid container justify="center" alignItems="center" item xs={12}>
                <Grid item lg={1} xs={6}>
                    <Typography style={{paddingTop: "20px"}}>{t('totalEmittedCoinLabel')}</Typography>
                </Grid>
                <Grid item lg={1} xs={6}>
                    <TextField 
                        id={formFieldsNames.totalEmittedCoin}
                        name={formFieldsNames.totalEmittedCoin}
                        size="medium"
                        className={classes.textFields}
                        type="number"
                        inputProps= {{ min: minimumTotalEmittedCoin, step: 1}}
                        value={totalEmittedCoin}
                        //max={} //TODO put here 
                        onChange={(event) => {
                            formik.setFieldValue(formFieldsNames.totalEmittedCoin, event.target.value);
                            setTotalEmittedCoin(event.target.value);
                        }}
                        label="Quantity"
                    />
                </Grid>

                <Grid item lg={2} xs={12}>
                    <TextField 
                        select
                        id={formFieldsNames.emittedCoin}
                        name={formFieldsNames.emittedCoin}
                        size="medium"
                        className={classes.select}
                        value={selectedEmittedCoin}
                        onChange={(event) => handleEmittedCoinSelect(event)}
                        label="The coupon to distribute"
                    >
                        {ownedCoupons.map( (coupon, index) => {
                            return (
                                <MenuItem key={coupon.symbol} value={index} key={index}>
                                    <Grid container justify="space-around" alignItems="center">
                                        <Grid item xs={6}>
                                            <Avatar
                                                alt={coupon.symbol}
                                                src={coupon.logoFile}
                                                style={{marginRight: "5px"}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {coupon.symbol}
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                            )
                        })}
                    </TextField>
                </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(0)}
                    >
                    GO PREV
                </Button>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(2)}
                    >
                    GO NEXT
                </Button>
            </Grid>
        </Grid>
    );
}

export default FormStep1;
