export const assetDecimalRepresentationToInteger = (initialValue: number | string, numberOfDecimals: number) => {
    //return (parseFloat(initialValue).toFixed(2) * Math.pow(10, numberOfDecimals)).toFixed(2);
    return (parseFloat(initialValue.toString()) * Math.pow(10, numberOfDecimals)).toFixed(2);
};

export const assetIntegerToDecimalRepresentation = (initialValue: number | string, numberOfDecimals: number) => {
    const result = parseInt(initialValue.toString()) / Math.pow(10, numberOfDecimals);
    if( numberOfDecimals !== 0){
        return result.toFixed(2);
    }
    return result.toString();
};

