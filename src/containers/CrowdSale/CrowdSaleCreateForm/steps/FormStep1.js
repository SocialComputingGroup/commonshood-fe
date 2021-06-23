import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';
import {coinGetBalance} from '../../../../api/coinAPI';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";


const useStyles = makeStyles( (theme) => {
    return createStyles({
        field: {
            margin: "0 5px 0 5px",
        },
        select:{
            margin: "0 5px 0 5px",
            minWidth: "200px",
            [theme.breakpoints.only('xs')]: {
                margin: "20px 5px 20px 5px",
            },
        }
    });
});

const FormStep1 = (props) => {
    const {
        formik,
        setStep,
        ownedCoupons,
        currentAccount,
        web3
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

    const [selectedEmittedCoinIndex, setSelectedEmittedCoinIndex] = useState(values[formFieldsNames.indexEmittedCoin]);
    const minimumTotalEmittedCoin = 1;
    const [totalEmittedCoin, setTotalEmittedCoin] = useState(values[formFieldsNames.totalEmittedCoin]);
    const [selectedEmittedCoinBalanceText, setSelectedEmittedCoinBalanceText] = useState( t('loadingCouponBalance'));

    //managing warning message for when the totalEmittedCoin amount is > emittedCoinDisposability and so the user
    // must know he has to mint more coin in the near future if he wants to start this crowdsale
    let warningAboutMint = null;
    if(
        values[formFieldsNames.emittedCoinDisposability] !== null &&
        parseInt(totalEmittedCoin) > values[formFieldsNames.emittedCoinDisposability]
    ){
        warningAboutMint = (
            <Typography style={{paddingTop: "20px"}} color="error">
                {t('emissionExcedingBalance')}
            </Typography>
        )
    }

    useEffect( () => {
        setFieldValue(formFieldsNames.emittedCoin, ownedCoupons[selectedEmittedCoinIndex]); //initialize correctly
    }, []); //run only once

    useEffect( () => {
        if(
            values[formFieldsNames.emittedCoin]?.address != null &&
            ownedCoupons[selectedEmittedCoinIndex]?.address != null &&
            values[formFieldsNames.emittedCoin].address.localeCompare( ownedCoupons[selectedEmittedCoinIndex].address )
        ){
            setFieldValue(formFieldsNames.emittedCoin, ownedCoupons[selectedEmittedCoinIndex]);
        }
    }, [ownedCoupons, formik]);

    useEffect( () => {
        //this is ugly but it's the suggested way to call an async method from inside useEffect
        const f = async() => {
            const coinData = await coinGetBalance(web3, currentAccount, ownedCoupons[selectedEmittedCoinIndex].address);
            logger.info("got coinData", coinData);
            setSelectedEmittedCoinBalanceText(`${t('couponBalance')}: ${coinData.balance}`);
            setFieldValue(formFieldsNames.emittedCoinDisposability, coinData.balance);
        }
        f();
    }, [ values[formFieldsNames.indexEmittedCoin] ]);

    const handleEmittedCoinSelect = (event) => {
        setFieldValue(formFieldsNames.emittedCoin, ownedCoupons[event.target.value]);
        setFieldValue(formFieldsNames.indexEmittedCoin, event.target.value);
        setSelectedEmittedCoinIndex(event.target.value);
    };

    return (
        <Grid 
            container 
            justify='center' 
            alignItems='flex-start' 
            item xs={12}
            style={{marginTop: "20px"}}
            >
            <Grid container justify="center" alignItems="flex-end" item xs={12}>
                <Grid item lg={3} xs={12}>
                    <Typography style={{paddingTop: "20px"}}>{t('couponQuantity')}:</Typography>
                </Grid>
                <Grid item lg={1} xs={12}>
                    <TextField 
                        id={formFieldsNames.totalEmittedCoin}
                        name={formFieldsNames.totalEmittedCoin}
                        size="medium"
                        className={classes.field}
                        type="number"
                        inputProps= {{ min: minimumTotalEmittedCoin, step: 1}}
                        value={totalEmittedCoin}
                        //max={} //TODO put here 
                        onChange={(event) => {
                            setFieldValue(formFieldsNames.totalEmittedCoin, event.target.value);
                            setTotalEmittedCoin(event.target.value);
                        }}
                        label={t('amount')}
                        onBlur={handleBlur}
                        error={(errors[formFieldsNames.totalEmittedCoin] != null) && touched[formFieldsNames.totalEmittedCoin]}
                        helperText={touched[formFieldsNames.totalEmittedCoin] ? errors[formFieldsNames.totalEmittedCoin] : null}
                    />
                </Grid>

                <Grid item lg={2} xs={12}>
                    <TextField 
                        select
                        id={formFieldsNames.emittedCoin}
                        name={formFieldsNames.emittedCoin}
                        size="medium"
                        className={classes.select}
                        value={selectedEmittedCoinIndex}
                        onChange={(event) => handleEmittedCoinSelect(event)}
                        label={t('coupon')}
                    >
                        {ownedCoupons.map( (coupon, index) => {
                            return (
                                <MenuItem key={coupon.symbol} value={index}>
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
                <Grid item xs={12}>
                    <Typography style={{paddingTop: "20px"}}>
                        {selectedEmittedCoinBalanceText}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                        {warningAboutMint}
                </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(0)}
                    >
                    {t('back')}
                </Button>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(2)}
                    >
                    {t('next')}
                </Button>
            </Grid>
        </Grid>
    );
}

export default FormStep1;
