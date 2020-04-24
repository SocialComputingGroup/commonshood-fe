import * as Yup from 'yup';
import {formFieldsNames} from './configForm';

export default function getValidationSchema() {
    // const MIN_SYMBOL = 3;
    // const MAX_SYMBOL = 5;
     const IMG_FILE_SIZE = 32000000;
     const CONTRACT_FILE_SIZE = 2097152; // 2MBytes
     const SUPPORTED_CONTRACT_FORMATS = ['application/pdf'];
     const SUPPORTED_IMG_FORMATS = ['image/jpg','image/jpeg','image/gif','image/png'];

    return Yup.object().shape({

        [formFieldsNames.bigTitle]: Yup.string().required("Insert a summary"),
        [formFieldsNames.details]: Yup.string().required("Insert a detailed description"),
        [formFieldsNames.startDate]: Yup.date().required('Start Date is Required'),
        [formFieldsNames.endDate]: Yup.date().test('pastDate', "End date can't be set before Start date", function(value) {
            return value > this.parent.startDate
        }),
        [formFieldsNames.totalEmittedCoin]: Yup.number('Emitted coin must be a number').required().positive('Emitted coupons must be a positive number').integer('Emitted coupons must be a integer'),
        [formFieldsNames.acceptedCoinRatio]: Yup.string().required()
            .matches(/^[0-9]+([.,][0-9][0-9]?)?$/, 'Accepted Coin Ratio must be a decimal number with 2 decimals max and dot "." as separator' )
            .test('parsedPositive', 'accepted coin ratio must be a positive number', value => value && parseFloat(value) > 0),
        //totalEmittedCoin: Yup.number().required().positive().integer('This total must be a positive integer'),
        [formFieldsNames.contract]: Yup.mixed()
            .required('A contract is required')
            .test('contractFileSize', "File Size is too large", value => value && value.size <= CONTRACT_FILE_SIZE)
            .test('contractFileFormat', "Unsupported File Format", value => value && SUPPORTED_CONTRACT_FORMATS.includes(value.type) ),
        [formFieldsNames.mainImage]: Yup.mixed()
             .required('An image is required')
             .test('imageFileSize', "File Size is too large", value => value && value.size <= IMG_FILE_SIZE)
             .test('imageFileFormat', "Unsupported File Format", value => value && SUPPORTED_IMG_FORMATS.includes(value.type) ),
    })

}