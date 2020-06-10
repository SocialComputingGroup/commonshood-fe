import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles( (theme) => {
    return createStyles({
        imageLabel: {
            borderColor: theme.palette.primary.main,
            borderStyle: "solid",
            borderSize: "1px",
            padding: "10px 35px 10px 35px",
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
        }
    });
});

const FormStep0 = (props) => {
    const {
        formik,
        setStep
    } = props;

    const classes = useStyles();
    const { t } = useTranslation('CrowdSaleCreateForm');

    const [mainImageBlob, setMainImageBlob] = useState(null);
    const [mainImageName, setMainImageName] = useState(null);
    const mainImageInputRef = React.createRef(); //this is necessary for how react manages inputs of type "file"
    
    useEffect( () => {
        if(formik.values[formFieldsNames.mainImage] != null){ //formik already contains an image precedently selected by the user
            setMainImageBlob(formik.values[formFieldsNames.mainImage]);
            setMainImageName(formik.values[formFieldsNames.mainImage].name);
        }
    });

    const imageInputFieldLabel = mainImageName === null ? t('mainImageTitle') : mainImageName;
    return (
        <Grid container justify='center' alignItems='flex-start' item xs={12}>
            <Grid item xs={12} style={{marginTop: "10px", marginBottom: "15px"}}>
                <label 
                    htmlFor={formFieldsNames.mainImage}
                    className={classes.imageLabel}
                    >
                    <input
                        id={formFieldsNames.mainImage}
                        name={formFieldsNames.mainImage}
                        type="file"
                        style={{display: "none",}} //we don't want to show directly the html file input which is hardly customizable for security reasons
                        onChange={(event) => {
                            formik.setFieldValue(formFieldsNames.mainImage, event.currentTarget.files[0]);
                            setMainImageBlob(event.currentTarget.files[0]);
                        }}
                        accept="image/*"
                        ref={mainImageInputRef}
                    />
                    {imageInputFieldLabel} <CloudUploadIcon color="primary" fontSize="large" style={{verticalAlign: "middle"}}/>
                </label>
            </Grid>
            <Grid item xs={12}>
                <img 
                    src={mainImageBlob != null ? URL.createObjectURL(mainImageBlob) : null} 
                    className={classes.imgPreview}
                    /> 
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField 
                    id={formFieldsNames.bigTitle}
                    name={formFieldsNames.bigTitle}
                    label={t('summaryPlaceholder')}
                    fullWidth
                    size="medium"
                    className={classes.textFields}
                    type="text"
                    value={formik.values[formFieldsNames.bigTitle]}
                    onChange={(event) => {
                        formik.setFieldValue(formFieldsNames.bigTitle, event.target.value);
                    }}
                />
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField 
                    id={formFieldsNames.details}
                    name={formFieldsNames.details}
                    multiline
                    label={t('detailsPlaceholder')}
                    fullWidth
                    size="medium"
                    className={classes.textFields}
                    type="text"
                    value={formik.values[formFieldsNames.details]}
                    onChange={(event) => {
                        formik.setFieldValue(formFieldsNames.details, event.target.value);
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={ () => setStep(1)}
                    >
                    GO NEXT
                </Button>
            </Grid>
        </Grid>
    );
}

export default FormStep0;