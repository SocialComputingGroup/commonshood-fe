export const formFieldsNames = Object.freeze({
    mainImage: 'mainImage',
    bigTitle: 'bigTitle',
    details: 'details',
    acceptedCoin: "acceptedCoin",
    emittedCoin: "emittedCoin",
    acceptedCoinRatio: "acceptedCoinRatio",
    emittedCoinRatio: "emittedCoinRatio",
    cap: "cap",
    coinsCouponsErrors: "coinsCouponsErrors",
    startDate: "startDate",
    endDate: "endDate",
    contract: "contract",
    totalEmittedCoin: 'totalEmittedCoin',
    totalAcceptedCoin: 'totalAcceptedCoin',
    forEachEmittedCoin: 'forEachEmittedCoin',
    addressSuggest: 'addressSuggest'
});

export const formFieldTypes = Object.freeze({
    imageInput: "imageInput",
    text: "text",
    select: "select",
    controlledNumberInput: "controlledNumberInput",
    datepicker: "datepicker",
    fileInput: "fileInput",
    naturalLanguageTextField: "naturalLanguageTextField",
    typography: "typography",
    addressSuggest: 'addressSuggest'
});

// t is the translation function of i18n passed by the calling component
const formSchema = (t) => {
    return [
        {
            name: formFieldsNames.mainImage,
            type: formFieldTypes.imageInput,
            initialValue: null,
            customProps: {
                title: t('mainImageTitle')
            }
        },
        {
            name: formFieldsNames.bigTitle,
            type: formFieldTypes.text,
            initialValue: undefined,
            customProps: {
                multiline: true,
                placeholder: t('summaryPlaceholder')
            }
        },
        {
            name: formFieldsNames.details,
            type: formFieldTypes.text,
            initialValue: undefined,
            customProps: {
                multiline: true,
                placeholder: t('detailsPlaceholder')
            }
        },
        {
            name: formFieldsNames.totalEmittedCoin,
            type: formFieldTypes.naturalLanguageTextField,
            initialValue: 1,
            customProps:{
                externalLabel: t('totalEmittedCoinLabel'),
                disabled: false,
                onlyInteger: true,
            }
        },
        {
            name: formFieldsNames.emittedCoin,
            type: formFieldTypes.select,
            //label: t('emittedCoinLabel'),
            initialValue: 0,
            customProps: {},
            inputLabelProps: {
                shrink: true
            },
            inputProps: {
                name: 'emittedCoin',
                id: 'emittedCoinId'
            }
        },
        {
            name: formFieldsNames.forEachEmittedCoin,
            type: formFieldTypes.naturalLanguageTextField,
            customProps:{
                externalLabel: t('forEachEmittedCoinLabel'),
                disabled: true,
            }
        },
        {
            name: formFieldsNames.acceptedCoinRatio,
            type: formFieldTypes.naturalLanguageTextField,
            customProps: {
                stepped: false,
                externalLabel: t('acceptCoinRatioLabel'),
            },
            initialValue: 0.01,
        },
        {
            name: formFieldsNames.acceptedCoin,
            type: formFieldTypes.select,
            //label: t('acceptedCoinLabel'),
            initialValue: 0,
            customProps: {},
            inputLabelProps: {
                shrink: true
            },
            inputProps: {
                name: 'acceptedCoin',
                id: 'acceptedCoinId'
            }
        },
        {
            name: formFieldsNames.totalAcceptedCoin,
            type: formFieldTypes.naturalLanguageTextField,
            customProps:{
                externalLabel: t('totalAcceptedCoinLabel'),
                disabled: true,
            }
        },
        {
            name: formFieldsNames.coinsCouponsErrors,
            type: formFieldTypes.typography,
            observedFieldNames: [formFieldsNames.totalEmittedCoin, formFieldsNames.acceptedCoinRatio],
            customProps:{
                //disabled: true,
                variant: 'caption',
                style: {color: 'red'}
            },
        },
        // {
        //     name: formFieldsNames.cap,
        //     type: formFieldTypes.naturalLanguageTextField,
        //     customProps: {
        //         externalLabel: t('capLabel'),
        //         fieldMaxLength: 7,
        //     },
        //     initialValue: 1
        // },
        {
            name: formFieldsNames.startDate,
            type: formFieldTypes.datepicker,
            initialValue: new Date(),
            customProps: {
                label: t('startDateLabel'),
                placeholder: "Start Date",
                adornmentPosition: "start",
                disablePast: true,
                format: "dd/MM/yyyy"
            }
        },
        {
            name: formFieldsNames.endDate,
            type: formFieldTypes.datepicker,
            today: new Date(),
            initialValue: ( () => {
                const today = new Date();
                let tomorrow = new Date();
                tomorrow.setDate(today.getDate() +1);
                return tomorrow;
            })(), //just to get tomorrow day
            customProps: {
                label: t('endDateLabel'),
                placeholder: "Start Date",
                adornmentPosition: "start",
                disablePast: true,
                format: "dd/MM/yyyy"
            }
        },
        {
            name: formFieldsNames.contract,
            type: formFieldTypes.fileInput,
            initialValue: undefined,
            inputProps: {
                placeholder: t('contractPlaceholder'),
            },
            formControlProps: {
                fullWidth: true
            }
        },
        {
            name: formFieldsNames.addressSuggest,
            type: formFieldTypes.addressSuggest,
            initialValue: ""
        }
    ];
};

export default formSchema;
