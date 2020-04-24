import axios from 'axios';
import config from '../../config';


const instance = axios.create (
    {baseURL:  config.network.firstLifeApi.url}
);

export default instance