import axiosAuth from "../utilities/backend/axios-strongloop";

export const getDataById = async (userId: string | null): Promise<any> => {
    return await axiosAuth.get('/Persons/' + userId)
}

export const getDataByParams = async (params: any): Promise<any> => {
    return await axiosAuth.get('/Persons/' + params)
}

export const getWallet= async (retrieverListId: number): Promise<any> =>{

    const filter = `{"where": {"userId": "${retrieverListId}" }}`
    return await axiosAuth.get('/Bank?filter=' + filter);
}

export const getList= async (userIds: number[]) : Promise<any> => {
    let params = {};
    let filter = '{"where": {"id": {"inq": [';

    userIds.forEach(function(id) {
        filter = filter + '"'+id+'",'
    });

    filter = filter.slice(0,filter.lastIndexOf(","))+']}}}';

    await axiosAuth.get('/Persons?filter='+filter, params)
}
