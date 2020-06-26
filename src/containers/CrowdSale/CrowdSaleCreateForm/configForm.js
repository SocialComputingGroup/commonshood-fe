export const formFieldsNames = Object.freeze({
    mainImage: 'mainImage',
    bigTitle: 'bigTitle',
    details: 'details',
    indexAcceptedCoin: "indexAcceptedCoin", 
    acceptedCoin: "acceptedCoin",
    indexEmittedCoin: "indexEmittedCoin",
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

export const constraints = Object.freeze({
    TITLE_MIN_CHARS: 5,
    TITLE_MAX_CHARS: 50,
    DESCRIPTION_MIN_CHARS: 5,
    DESCRIPTION_MAX_CHARS: 500,
    IMG_FILE_SIZE: 32000000,
    CONTRACT_FILE_SIZE: 2097152, // 2MBytes
    SUPPORTED_CONTRACT_FORMATS: ['application/pdf'],
    SUPPORTED_CONTRACT_FORMAT_STRINGIFIED: '.pdf',
    SUPPORTED_IMG_FORMATS: ['image/jpg','image/jpeg','image/png'],
    SUPPORTED_IMG_FORMAT_STRINGIFIED: 'jpg, jpeg, png',
});