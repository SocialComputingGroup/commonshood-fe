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

    const classes = useStyles();
    const {t} = useTranslation('CrowdSaleCreateForm');

    const [startDate, setStartDate] = useState(formik.values[formFieldsNames.startDate]);
    const [endDate, setEndDate] = useState(formik.values[formFieldsNames.endDate]);
    const [contractFile, setContractFile] = useState(formik.values[formFieldsNames.contract]);
    const [contractName, setContractName] = useState(contractFile != null ? contractFile.name : null);
    const contractInputFieldLabel = contractName === null ? t('contractPlaceholder') : contractName;


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
                        id="startDateInput"
                        label={t('startDateLabel')}
                        type="date"
                        value={startDate} 
                        className={classes.dateField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={ (event) => {
                            formik.setFieldValue(formFieldsNames.startDate, event.target.value);
                            setStartDate(event.target.value);
                        }}
                    />
                </Grid>

                <Grid  item md={1} xs={12} className={classes.dateRow}>
                    <TextField
                        id="endDateInput"
                        label={t('endDateLabel')}
                        type="date"
                        value={endDate} 
                        className={classes.dateField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={ (event) => {
                            formik.setFieldValue(formFieldsNames.endDate, event.target.value);
                            setEndDate(event.target.value);
                        }}
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
                                formik.setFieldValue(formFieldsNames.contract, event.currentTarget.files[0]);
                                setContractFile(event.currentTarget.files[0]);
                                setContractName(event.currentTarget.files[0].name);
                            }}
                            accept=".pdf"
                            ref={contractInputRef}
                        />
                        <Typography style={{display: "inline-block"}}>{contractInputFieldLabel} - </Typography> 
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