import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( (theme) => {
    return createStyles({
        textFields: {
            margin: "10px 5px 10px 5px",
        },
        select:{
            margin: "10px 5px 10px 5px",
            minWidth: "200px",
        },
        avatar: { 
            display: "inline-block", 
            marginLeft: "10px", 
            marginRight: "5px"
        },
    });
});


const FormStep2 = (props) => {
    const {
        formik,
        setStep,
        allTokens
    } = props;
    const classes = useStyles();
    const { t } = useTranslation('CrowdSaleCreateForm');
    const emittedCoupon = formik.values[formFieldsNames.emittedCoin];

    const [acceptedCoinRatio, setAcceptedCoinRatio] = useState(formik.values[formFieldsNames.acceptedCoinRatio]);

    const [selectedAcceptedCoin, setSelectedAcceptedCoin] = useState(formik.values[formFieldsNames.indexAcceptedCoin]);

    useEffect( () => {
        if(formik.values[formFieldsNames.acceptedCoin].address != allTokens[selectedAcceptedCoin].address ){
            formik.setFieldValue(formFieldsNames.acceptedCoin, allTokens[selectedAcceptedCoin]); //initialize correctly
        }
    }, [allTokens, formik]);

    const handleAcceptedCoinSelect = (event) => {
        formik.setFieldValue(formFieldsNames.acceptedCoin, allTokens[event.target.value]);
        formik.setFieldValue(formFieldsNames.indexAcceptedCoin, event.target.value);
        setSelectedAcceptedCoin(event.target.value);
    };

    return(
        <Grid 
            container 
            justify='center' 
            alignItems='flex-start' 
            item xs={12}
            style={{marginTop: "20px"}}
            >
            <Grid container justify="center" alignItems="center" item xs={12}>
                <Grid item xs={12}>
                    <Typography style={{display: "inline-block", paddingTop: "20px"}}>{t('forEachEmittedCoinLabel')} {formik.values[formFieldsNames.forEachEmittedCoin]}</Typography>
                    <Avatar
                        alt={emittedCoupon.symbol}
                        src={emittedCoupon.logoFile}
                        className={classes.avatar}
                    />
                    <Typography style={{display: "inline-block"}}>{emittedCoupon.symbol}</Typography>
                </Grid>

                <Grid container justify="center" alignItems="center" item xs={12}>
                    <Grid item lg={1} xs={6}>
                        <Typography style={{display: "inline-block", paddingTop: "20px"}}>{t('acceptCoinRatioLabel')}</Typography>
                    </Grid>
                    <Grid item lg={1} xs={6}>
                        <TextField 
                            id={formFieldsNames.acceptedCoinRatio}
                            name={formFieldsNames.acceptedCoinRatio}
                            size="medium"
                            className={classes.textFields}
                            type="number"
                            inputProps= {{ min: 0.01, step: 0.10}}//max={} //TODO put here 
                            value={acceptedCoinRatio}
                            onChange={(event) => {
                                formik.setFieldValue(formFieldsNames.acceptedCoinRatio, event.target.value);
                                setAcceptedCoinRatio(event.target.value);
                            }}
                            label="Quantity"
                        />
                    </Grid>
                    <Grid item lg={1} xs={12}>
                        <TextField 
                            select
                            id={formFieldsNames.acceptedCoin}
                            name={formFieldsNames.acceptedCoin}
                            size="medium"
                            className={classes.select}
                            value={selectedAcceptedCoin}
                            onChange={(event) => handleAcceptedCoinSelect(event)}
                            label="The coin to accept"
                        >
                            {allTokens.map( (token, index) => {
                                return (
                                    <MenuItem key={token.symbol} value={index} key={index}>
                                        <Grid container justify="space-around" alignItems="center">
                                            <Grid item xs={6}>
                                                <Avatar
                                                    alt={token.symbol}
                                                    src={token.logoFile}
                                                    style={{marginRight: "5px"}}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                {token.symbol}
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(1)}
                    >
                    GO PREV
                </Button>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(3)}
                    >
                    GO NEXT
                </Button>
            </Grid>
        </Grid>
    )
};

export default FormStep2;