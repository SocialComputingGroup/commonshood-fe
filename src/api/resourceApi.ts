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

export const getImg = async (logoHash: string) : Promise<AxiosResponse<any>> => {
    const url = '/Resources/get/';
    const params = {};
    return await axios.get(url+logoHash, params);
}

export const getTOSFile = async (tosHash: string) : Promise<AxiosResponse<any>> => {
    const url = '/Resources/get/';
    const params = {};
    return await axios.get(url+tosHash, params);
}
