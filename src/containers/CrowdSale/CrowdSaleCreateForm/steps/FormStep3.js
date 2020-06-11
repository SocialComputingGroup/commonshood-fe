import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import {Grid, Button, Typography, TextField, MenuItem, Avatar} from "@material-ui/core";
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( (theme) => {
    return createStyles({
        dateField: {
            width: "150px",
        },
        dateRow: {
            [theme.breakpoints.up('xs')]: {
                marginLeft: theme.spacing(5),
                marginRight: theme.spacing(5),
            },
            [theme.breakpoints.only('xs')]: {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1)
            },
        }

    });
});

const FormStep3 = (props) => {
    const {
        formik,
        setStep,
    } = props;

    const{
        errors,
        touched,
        values,
        handleBlur, //this is passed to onBlur of field to let formik manage touched event
        setFieldValue
    } = formik;

    const classes = useStyles();
    const {t} = useTranslation('CrowdSaleCreateForm');

    const [startDate, setStartDate] = useState(values[formFieldsNames.startDate]);
    const [endDate, setEndDate] = useState(values[formFieldsNames.endDate]);
    const [contractFile, setContractFile] = useState(values[formFieldsNames.contract]);
    const [contractName, setContractName] = useState(contractFile != null ? contractFile.name : null);
    
    let contractInputFieldLabel = null;
    if( (errors[formFieldsNames.contract] != null)){
        contractInputFieldLabel = (
            <Typography style={{display: "inline-block", color: "#f44336"}}> 
                {errors[formFieldsNames.contract]} - 
            </Typography> 
        )
    }else{
        contractInputFieldLabel = (
            <Typography style={{display: "inline-block"}}> 
                {contractName === null ? t('contractPlaceholder') : contractName} - 
            </Typography> 
        )
    }

    const contractInputRef = React.createRef(); //this is necessary for how react manages inputs of type "file"

    return ( 
        <Grid 
            container 
            justify='center' 
            alignItems='flex-start' 
            item xs={12}
            style={{marginTop: "20px"}}
            >

            <Grid container justify="center" alignItems="center" item xs={12}>

                <Grid  item md={1} xs={12} className={classes.dateRow}>
                    <TextField
                        id={formFieldsNames.startDate}
                        name={formFieldsNames.startDate}
                        label={t('startDateLabel')}
                        type="date"
                        value={startDate} 
                        className={classes.dateField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={ (event) => {
                            setFieldValue(formFieldsNames.startDate, event.target.value);
                            setStartDate(event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={(errors[formFieldsNames.startDate] != null) && touched[formFieldsNames.startDate]}
                        helperText={touched[formFieldsNames.startDate] ? errors[formFieldsNames.startDate] : null}
                    />
                </Grid>

                <Grid  item md={1} xs={12} className={classes.dateRow}>
                    <TextField
                        id={formFieldsNames.endDate}
                        name={formFieldsNames.endDate}
                        label={t('endDateLabel')}
                        type="date"
                        value={endDate} 
                        className={classes.dateField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={ (event) => {
                            setFieldValue(formFieldsNames.endDate, event.target.value);
                            setEndDate(event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={(errors[formFieldsNames.endDate] != null) && touched[formFieldsNames.endDate]}
                        helperText={touched[formFieldsNames.endDate] ? errors[formFieldsNames.endDate] : null}
                    />
                </Grid>

                <Grid item xs={12} style={{marginTop: "25px", marginBottom: "15px"}}>
                    <label 
                        htmlFor={formFieldsNames.contract}
                        // className={classes.imageLabel}
                        >
                        <input
                            id={formFieldsNames.contract}
                            name={formFieldsNames.contract}
                            type="file"
                            style={{display: "none",}} //we don't want to show directly the html file input which is hardly customizable for security reasons
                            onChange={(event) => {
                                setFieldValue(formFieldsNames.contract, event.currentTarget.files[0]);
                                setContractFile(event.currentTarget.files[0]);
                                setContractName(event.currentTarget.files[0].name);
                            }}
                            accept=".pdf"
                            ref={contractInputRef}
                        />
                        {contractInputFieldLabel}
                        <AttachFileIcon color="primary" fontSize="large" style={{verticalAlign: "middle"}}/>
                    </label>
                </Grid>
            </Grid>


            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(2)}
                    >
                    GO PREV
                </Button>
            </Grid>
            <Grid item md={6} xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    //onClick={}
                    >
                    CONFIRM
                </Button>
            </Grid>

        </Grid>
    );
}

export default FormStep3;