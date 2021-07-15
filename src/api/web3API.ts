import axiosAuth from "../utilities/backend/axios-strongloop";

export const putData = async (putData: {}): Promise<any>=>{
    await axiosAuth.put('/Bank', putData);
}

export const getBackendWalletsForUser = async (userId: number) : Promise<any>=> {
    let params = {};
    const filter = `{"where": {"userId": "${userId}" }}`
    const res = await axiosAuth.get('/Bank?filter=' + filter, params);
    return res.data[0];
}