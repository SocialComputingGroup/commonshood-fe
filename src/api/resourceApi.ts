import axios from '../utilities/backend/axios-strongloop';

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
