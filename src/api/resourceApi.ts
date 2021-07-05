import axios from '../utilities/backend/axios-strongloop';
import {AxiosResponse} from "axios";

export const uploadResource = async (file: File) : Promise<{fileHash: string, fileUrl: string}> => {
    const configFileHeader = {
        headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const url = '/Resources/upload';
    let formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(url, formData, configFileHeader);

    const fileHash = response.data.file.hash;
    const fileUrl = response.data.file.url;

    return {
        fileHash,
        fileUrl
    };
};

export const getCrowdsaleStatus= async (crowdsaleId: number) : Promise<AxiosResponse<any>> =>{
    const url = `/Crowdsales/${crowdsaleId}/getStatus`;
    return await axios.get(url); // TODO: check the return value
}

export const getMyReservations= async (crowdsaleId: number) : Promise<AxiosResponse<any>> =>{
    const url = `/Crowdsales/${crowdsaleId}/getMyReservation`;
    return await axios.get(url); // TODO: check the return value
}

export const postCrowdsaleUnlock= async (crowdsaleId: number) : Promise<AxiosResponse<any>> => {
    const url = `/Crowdsales/${crowdsaleId}/unlock`;
    return await axios.post(url); // TODO: check the return value
}

export const getCoinBalanceURL= async (coinTicker: any, realm:string, currentProfile: any) : Promise<AxiosResponse<any>> => {
    let getBalanceOfCoinURL = '';
    if(realm === 'user'){
        getBalanceOfCoinURL = `Coins/${coinTicker}/MyBalance`;
    }else if(realm === 'dao'){
        //currentProfile.id is a firstlifeplaceid here
        getBalanceOfCoinURL = `DAOS/${currentProfile.id}/balance/${coinTicker}`;
    }else{
        throw new Error('You are not a user nor a dao, what are you? Realm: ' + realm);
    }
    return await axios.get(getBalanceOfCoinURL);
}

export const getImg= async (logoHash: string) : Promise<AxiosResponse<any>> => {
    const url = '/Resources/get/';
    const params = {};
    return await axios.get(url+logoHash, params);
}

export const getTos= async (tosHash: string) : Promise<AxiosResponse<any>> => {
    const url = '/Resources/get/';
    const params = {};
    return await axios.get(url+tosHash, params);
}
