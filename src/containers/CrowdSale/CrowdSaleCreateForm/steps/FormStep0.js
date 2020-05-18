import React, { useState, useEffect } from 'react';
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';

const FormStep0 = (props) => {
    const {
        formik,
        setStep
    } = props;

    const [mainImageBlob, setMainImageBlob] = useState(null);
    const mainImageInputRef = React.createRef(); //this is necessary for how react manages inputs of type "file"
    
    useEffect( () => {
        if(formik.values[formFieldsNames.mainImage] != null){ //formik already contains an image precedently selected by the user
            setMainImageBlob(formik.values[formFieldsNames.mainImage]);
        }
    });

    logger.info("CrowdsaleCreateForm form values: ", formik.values);

    return (
        <div>
            <label htmlFor={formFieldsNames.mainImage}>
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
                ImageUpload
            </label>
            <img src={mainImageBlob != null ? URL.createObjectURL(mainImageBlob) : null} /> 
            <button onClick={ () => setStep(1)}>GO NEXT</button>
        </div>
    );
}

export default FormStep0;