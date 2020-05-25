import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";

const useStyles = makeStyles( (theme) => {
    return createStyles({
        imageLabel: {
            borderColor: theme.palette.primary.main,
            borderStyle: "solid",
            borderSize: "1px",
            padding: "10px",
        },
        imgPreview: {
            display: "block",
            height: "100%",
            width: "100%",
            maxHeight: "300px",
            maxWidth: "300px",
            margin: "auto",
        },
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

    return (
        <Grid 
            container 
            justify='center' 
            alignItems='flex-start' 
            item xs={12}
            style={{marginTop: "20px"}}
            >
            <Grid container justify="center" alignItems="center" item xs={12}>
                <Grid item md={1} xs={6}>
                    <Typography style={{paddingTop: "20px"}}>{t('totalEmittedCoinLabel')}</Typography>
                </Grid>
                <Grid item md={1} xs={6}>
                    <TextField 
                        id={formFieldsNames.totalEmittedCoin}
                        name={formFieldsNames.totalEmittedCoin}
                        size="medium"
                        className={classes.textFields}
                        type="number"
                        inputProps= {{ min: 1, step: 1}}
                        //max={} //TODO put here 
                        onChange={(event) => {
                            formik.setFieldValue(formFieldsNames.totalEmittedCoin, event.target.value);
                        }}
                        label="Quantity"
                    />
                </Grid>

                <Grid item md={2} xs={12}>
                    <TextField 
                        select
                        id={formFieldsNames.emittedCoin}
                        name={formFieldsNames.emittedCoin}
                        size="medium"
                        className={classes.select}
                        onChange={(event) => {
                            formik.setFieldValue(formFieldsNames.emittedCoin, event.target.value);
                        }}
                        label="The coupon to distribute"
                    >
                        {ownedCoupons.map( (coupon) => {
                            return (
                                <MenuItem key={coupon.symbol} value={coupon.address}>
                                   <Avatar
                                        alt={coupon.symbol}
                                        src={coupon.logoFile}
                                        style={{marginRight: "5px"}}
                                    /> - {coupon.symbol}
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
