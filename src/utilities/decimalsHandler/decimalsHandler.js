export const assetDecimalRepresentationToInteger = (initialValue, numberOfDecimals) => {
    return (parseFloat(initialValue).toFixed(2) * Math.pow(10, numberOfDecimals)).toFixed(2);
};

export const assetIntegerToDecimalRepresentation = (initialValue, numberOfDecimals) => {
    const result = parseInt(initialValue) / Math.pow(10, numberOfDecimals);
    if( numberOfDecimals !== 0){
        return result.toFixed(2);
    }
    return result;
};
