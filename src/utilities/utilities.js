import {logger} from '../utilities/winstonLogging/winstonInit';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

// Promise delay
export const delay = (time, value) => {
    return new Promise ( (resolve) => {
        setTimeout(resolve.bind(null,value), time)
    })
};

//convert from base64 string to buffer
export const base64ToArrayBuffer = (data) =>  {
    const dataString = data.substring(data.indexOf(",") + 1);
    const binaryString = window.atob(dataString);
    const binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

//Objects string comparison by property name
export const alphabeticComparisonObj = (a,b, propertyName) => {
    const aUpper = a[propertyName].toUpperCase();
    const bUpper = b[propertyName].toUpperCase();
    if ( aUpper < bUpper) { return -1; }
    if ( aUpper > bUpper) { return 1;}
    return 0;
};

//Array comparison
export const arrayComparison = (arrayA,arrayB) => {
    return JSON.stringify(arrayA) === JSON.stringify(arrayB)
};

export const maxNumComparisonObj = (a,b,propertyName) => {
    return (a[propertyName] > b[propertyName]);
};

//Calculate distance for Geo json objects
export const distanceBetweenCoordinates = (a, b) => {
    return Math.sqrt(Math.pow(b.latitude - a.latitude, 2) + Math.pow(b.longitude - a.longitude,2));
};

//Dovrebbe essere corretto questa
export const calculateDistance = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return Math.round(d*1000);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

export const listIntoArray = (obj) => Object.keys(obj).map(key => obj[key]);

export const isProfileChanged = (prevProfile, currentProfile) => {
    if(prevProfile.id !== currentProfile.id) {
        logger.debug("[PREVIOUS PROFILE] =>", prevProfile);
        logger.debug("[CURRENT_PROFILE] =>", currentProfile);
    }
    return (prevProfile.id !== currentProfile.id);
};

export const getRandomNumberInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1)) + min;
};