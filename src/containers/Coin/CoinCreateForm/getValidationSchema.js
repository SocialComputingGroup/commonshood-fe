import * as Yup from 'yup';

export default function getValidationSchema(t) {
    const MIN_SYMBOL = 3;
    const MAX_SYMBOL = 5;
    const FILE_SIZE = 16000000; //~16mb
    const CONTRACT_FILE_SIZE = 20971520; // ~20MBytes
    const SUPPORTED_CONTRACT_FORMATS = ['application/pdf'];
    const SUPPORTED_FORMATS = ['image/jpg','image/jpeg','image/gif','image/png'];

    return Yup.object().shape({
        coinName: Yup.string()
            .required(t('Common:required')),
        coinSymbol: Yup.string()
            .min(MIN_SYMBOL, t('coinSymbolMin', {params:{minSymbol: MIN_SYMBOL}}))
            .max(MAX_SYMBOL, t('coinSymbolMax', {params:{maxSymbol: MAX_SYMBOL}}))
            .matches(/^[a-zA-z0-9]*$/, {message: t('onlyChars'), excludeEmptyString: true})
            .required(t('Common:required')),
        coinDescription: Yup.string()
            .required(t('Common:required')),
        initialSupply: Yup.string('NOT STRING').required(t('Common:required'))
            .when('type', {
                is: 0,
                then: Yup.string().matches(/^([1-9][0-9]*)$|^([0-9]+([.][0-9][0-9]?))$/, t('NewCoinCreate_validationSchema:initialSupplyForCoin')),
            })
            .when('type', {
                is: 1, //coupon
                then: Yup.string().matches(/^[1-9][0-9]*$/, t('NewCoinCreate_validationSchema:initialSupplyForCoupon')),
            })
        ,
        cap: Yup.number()
            .typeError(t('Common:fieldIsNumber'))
        .moreThan(Yup.ref('initialSupply'),t('maxCap')),
            //.test('moreOrEqualThan', "Max supply should be at least as initial supply", value => value >= this.schema.initialSupply),
        // consent: Yup.bool()
        //     .test('consent', 'You have to agree with our Terms and Conditions!', value => value === true)
        //     .required('You have to agree with our Terms and Conditions!'),
        iconFile: Yup.mixed()
            .required(t('iconRequired'))
            .test('fileSize', t('Common:fileSizeLarge'), value => value && value.size <= FILE_SIZE)
            .test('fileType', t('Common:formatUnsupported') , value => value && SUPPORTED_FORMATS.includes(value.type) ),
        contractFile: Yup.mixed()
            .required(t('contractRequired'))
            .test('contractFileSize', t('Common:fileSizeLarge'), value => value && value.size <= CONTRACT_FILE_SIZE)
            .test('contractFileFormat', t('Common:formatUnsupported'), value => value && SUPPORTED_CONTRACT_FORMATS.includes(value.type) ),
    })
}