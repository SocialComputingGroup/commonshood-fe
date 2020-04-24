//
//  Redux Wallet Action dispatchers
//

import {logger} from '../../utilities/winstonLogging/winstonInit';

//Import axios HOC for REST Call to strongloop
import axios from '../../utilities/backend/axios-firstlife';
import axiosLoopback from '../../utilities/backend/axios-strongloop';

// Import action types
import * as actionTypes from './actionTypes';

//SYNC Action Creators to be dispatched

//Start loading data
export const placeStart = () => {
    return {
        type: actionTypes.PLACE_START
    }
};

// Get places
export const placeGet = (places) => {
    return {
        type: actionTypes.PLACE_GET,
        places: places
    }
};

//Reset places list
export const placeReset = () => {
    return {
        type: actionTypes.PLACE_RESET
    }
};

export const placeError = (error) => {
    return {
        type: actionTypes.PLACE_FAIL,
        error: error
    }
};

//get daos

export const daosGet = (daos) => {
    return {
        type: actionTypes.DAOS_GET,
        daos: daos
    }
}

//ASYNC dispatchers

//Get places
export const placeGetPlaces = (latitude,longitude,distance,name) => {
    return dispatch => {
        dispatch (placeStart());
        logger.debug('[FIRST LIFE PARAM SEARCH] =>', name, latitude, longitude, distance);
        const params = {
            params: {
                lon: longitude,
                lat: latitude,
                distance: distance,
                domainId: "35",
                query: name ? name : null
            }
        };
        
        axios.get('Things/near', params)
            .then ((response) => {
                logger.debug('[FIRST LIFE PLACES RESPONSE] => ', response);
                //response.data.things.features is an array which contains all the FL places 
                const arrayOfFLPlaces = response.data.things.features;
                const placesHashMap = new Map(); // we use this later to compose the object to send to the reducer

                const ids = arrayOfFLPlaces.map( (place) => {
                    placesHashMap.set(
                        place._id, 
                        {
                            ...place.properties, 
                            coordinates: place.geometry.coordinates
                        });
                    return place._id;
                });
                logger.debug('[FIRSTLIFE PLACES RESPONSE IDS] => ', ids);

                const params = { 
                    params: {
                        filter: {
                            where: {
                                'firstLifePlaceID': {
                                    'inq': //loopback where clause for "value match any of those in array"
                                        ids
                                }
                            }    
                        }
                    }
                };
        
                const url = `DAOS`;
        
                axiosLoopback.get(url, params)
                    .then((filteredDaosResponse) =>{
                        logger.debug('[TRUE DAOS] => ', filteredDaosResponse);
                        const filteredDaosData =  filteredDaosResponse.data.map( (dao) =>{
                            const flPlace = placesHashMap.get(dao.firstLifePlaceID);
                            
                            //we are gonna return
                            // the full dao object in the database of this application
                            // what we need from the FirstLife place object related
                            return{
                                ...dao,
                                FLName: flPlace.name,
                                address: flPlace.address,
                                entity_type: flPlace.entity_type,
                                description: flPlace.description,
                                coordinates: flPlace.coordinates,
                                realm: 'dao',
                            };
                        });

                        dispatch (placeGet(filteredDaosData));

                    }).catch((error) => {
                        logger.error('[IN PLACES.JS] => ', error);
                        dispatch(placeError(error));
                    });

                //dispatch (placeGet(response.data.things.features));
            })
            .catch( (error) => {
                logger.error('[IN PLACES.JS] => ', error)
                dispatch(placeError(error));
            });
        
    }
};

//Get daos
export const placesGetDaos = () => {
    return dispatch => {
        axiosLoopback.get("DAOS")
            .then((response) => {
                    dispatch (daosGet(response.data))
            })
            .catch((error) => {
                logger.error('[IN PLACES.JS] => ', error)
                dispatch (daosGet(null))
            })
    }
};