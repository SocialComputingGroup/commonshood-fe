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
    const classes = useStyles();
    const { t } = useTranslation('CrowdSaleCreateForm');
    const emittedCoupon = formik.values[formFieldsNames.emittedCoin];

    const [acceptedCoinRatio, setAcceptedCoinRatio] = useState(formik.values[formFieldsNames.acceptedCoinRatio]);

    const [selectedAcceptedCoin, setSelectedAcceptedCoin] = useState(formik.values[formFieldsNames.indexAcceptedCoin]);

    useEffect( function initializeAcceptedCoin() {
        if(formik.values[formFieldsNames.acceptedCoin].address != allTokens[selectedAcceptedCoin].address ){
            formik.setFieldValue(formFieldsNames.acceptedCoin, allTokens[selectedAcceptedCoin]); //initialize correctly
        }
    }, [allTokens, formik]);

    useEffect( function updateTotalAcceptedCoin(){
        let newTotalAcceptedCoin = formik.values[formFieldsNames.totalEmittedCoin] * formik.values[formFieldsNames.acceptedCoinRatio];
        newTotalAcceptedCoin = Number(newTotalAcceptedCoin.toFixed(2)); //format to have two decimals
        if(formik.values[formFieldsNames.totalAcceptedCoin] !== newTotalAcceptedCoin){
            formik.setFieldValue(formFieldsNames.totalAcceptedCoin, newTotalAcceptedCoin);
        }
    }, [formik]);

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
                <Grid item xs={12} className={classes.formRow}>
                    <Typography style={{display: "inline-block", paddingTop: "20px"}}>{t('forEachEmittedCoinLabel')} {formik.values[formFieldsNames.forEachEmittedCoin]}</Typography>
                    <Avatar
                        alt={emittedCoupon.symbol}
                        src={emittedCoupon.logoFile}
                        className={classes.avatar}
                    />
                    <Typography style={{display: "inline-block"}}>{emittedCoupon.symbol}</Typography>
                </Grid>

                <Grid container justify="center" alignItems="flex-end" item xs={12} className={classes.formRow}>
                    <Grid item lg={1} xs={6}>
                        <Typography style={{display: "inline-block", paddingTop: "20px"}}>{t('acceptCoinRatioLabel')}</Typography>
                    </Grid>
                    <Grid item lg={1} xs={6}>
                        <TextField 
                            id={formFieldsNames.acceptedCoinRatio}
                            name={formFieldsNames.acceptedCoinRatio}
                            size="medium"
                            className={classes.field}
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

                <Grid item lg={12} xs={12} className={classes.formRow}>
                    <Typography style={{display: "inline-block", paddingTop: "20px"}}>
                        {t("totalAcceptedCoinLabel")} {formik.values[formFieldsNames.totalAcceptedCoin]}
                    </Typography>
                    <Avatar
                        style={{display: "inline-block", marginLeft: "10px"}}
                        alt={formik.values[formFieldsNames.acceptedCoin].symbol}
                        src={formik.values[formFieldsNames.acceptedCoin].logoFile}
                        className={formik.values[formFieldsNames.acceptedCoin].avatar}
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