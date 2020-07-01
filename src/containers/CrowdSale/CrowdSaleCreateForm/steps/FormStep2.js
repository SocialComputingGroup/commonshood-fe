import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( (theme) => {
    return createStyles({
        field: {
            margin: "0 5px 0 5px",
        },
        select:{
            minWidth: "200px",
            margin: "0 5px 0 5px",
            [theme.breakpoints.only('xs')]: {
                margin: "20px 5px 20px 5px",
            },

        },
        avatar: { 
            display: "inline-block", 
            marginLeft: "10px", 
            marginRight: "5px"
        },
        formRow: {
            margin: "25px 0 25px 0",
            [theme.breakpoints.only('xs')]: {
                margin: "15px 0 15px 0",
            },
        }
    });
});


const FormStep2 = (props) => {
    const {
        formik,
        setStep,
        allTokens
    } = props;

    const{
        errors,
        touched,
        values,
        handleBlur, //this is passed to onBlur of field to let formik manage touched event
        setFieldValue
    } = formik;
    
    const classes = useStyles();
    const { t } = useTranslation('CrowdSaleCreateForm');
    const emittedCoupon = values[formFieldsNames.emittedCoin];

    const [acceptedCoinRatio, setAcceptedCoinRatio] = useState(values[formFieldsNames.acceptedCoinRatio]);

    const [selectedAcceptedCoin, setSelectedAcceptedCoin] = useState(values[formFieldsNames.indexAcceptedCoin]);

    useEffect( function initializeAcceptedCoin() {
        if(values[formFieldsNames.acceptedCoin].address != allTokens[selectedAcceptedCoin].address ){
            setFieldValue(formFieldsNames.acceptedCoin, allTokens[selectedAcceptedCoin]); //initialize correctly
        }
    }, [allTokens, formik]);

    useEffect( function updateTotalAcceptedCoin(){
        let newTotalAcceptedCoin = values[formFieldsNames.totalEmittedCoin] * values[formFieldsNames.acceptedCoinRatio];
        newTotalAcceptedCoin = Number(newTotalAcceptedCoin.toFixed(2)); //format to have two decimals
        if(values[formFieldsNames.totalAcceptedCoin] !== newTotalAcceptedCoin){
            setFieldValue(formFieldsNames.totalAcceptedCoin, newTotalAcceptedCoin);
        }
    }, [formik]);

    const handleAcceptedCoinSelect = (event) => {
        setFieldValue(formFieldsNames.acceptedCoin, allTokens[event.target.value]);
        setFieldValue(formFieldsNames.indexAcceptedCoin, event.target.value);
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
                <Grid item xs={12} className={classes.formRow}>
                    <Typography style={{display: "inline-block", paddingTop: "20px"}}>{t('forEachCoupon')} {values[formFieldsNames.forEachEmittedCoin]}</Typography>
                    <Avatar
                        alt={emittedCoupon.symbol}
                        src={emittedCoupon.logoFile}
                        className={classes.avatar}
                    />
                    <Typography style={{display: "inline-block"}}>{emittedCoupon.symbol} {t('coinsRatio')}</Typography>
                </Grid>

                <Grid container justify="center" alignItems="flex-end" item xs={12} className={classes.formRow}>
                    <Grid item lg={1} xs={12}>
                        <TextField 
                            id={formFieldsNames.acceptedCoinRatio}
                            name={formFieldsNames.acceptedCoinRatio}
                            size="medium"
                            className={classes.field}
                            type="number"
                            inputProps= {{ min: 0.01, step: 0.10}}//max={} //TODO put here 
                            value={acceptedCoinRatio}
                            onChange={(event) => {
                                setFieldValue(formFieldsNames.acceptedCoinRatio, event.target.value);
                                setAcceptedCoinRatio(event.target.value);
                            }}
                            label={t('amount')}
                            onBlur={handleBlur}
                            error={(errors[formFieldsNames.acceptedCoinRatio] != null) && touched[formFieldsNames.acceptedCoinRatio]}
                            helperText={touched[formFieldsNames.acceptedCoinRatio] ? errors[formFieldsNames.acceptedCoinRatio] : null}
                        />
                    </Grid>
                    <Grid item lg={2} xs={12}>
                        <TextField 
                            select
                            id={formFieldsNames.acceptedCoin}
                            name={formFieldsNames.acceptedCoin}
                            size="medium"
                            className={classes.select}
                            value={selectedAcceptedCoin}
                            onChange={(event) => handleAcceptedCoinSelect(event)}
                            label={t('coinToAccept')}
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

                <Grid item xs={12} className={classes.formRow}>
                    <Typography style={{display: "inline-block", paddingTop: "20px"}}>
                        {t("totalCoins")} {values[formFieldsNames.totalAcceptedCoin]}
                    </Typography>
                    <Avatar
                        style={{display: "inline-block", marginLeft: "10px"}}
                        alt={values[formFieldsNames.acceptedCoin].symbol}
                        src={values[formFieldsNames.acceptedCoin].logoFile}
                        className={values[formFieldsNames.acceptedCoin].avatar}
                    />
                </Grid>
            </Grid>

            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(1)}
                    >
                    {t('back')}
                </Button>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(3)}
                    >
                    {t('next')}
                </Button>
            </Grid>
        </Grid>
    )
};

export default FormStep2;