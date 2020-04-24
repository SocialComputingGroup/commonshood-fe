import axios from 'axios';
import config from '../../config';
import {logger} from '../winstonLogging/winstonInit';

const instance = axios.create (
    {baseURL:  config.network.loopback.URL}
);

export const loadToken = () => {
    const token = localStorage.getItem('token');
    if( token == null ){
        logger.debug('token still null ', token);
        setTimeout(loadToken, 250);
    }else{
        logger.debug('updating axios loopback with token: ', token);
        instance.defaults.headers.common['Authorization'] = token;
    }
};



instance.interceptors.response.use(undefined, err => {
    const error = err.response;

    // if error is 401
    if (error && error.status===401 &&
        error.config &&
        !error.config.__isRetryRequest
    ) {
        window.location = "/logout?logout=true";
    }
});

export default instance