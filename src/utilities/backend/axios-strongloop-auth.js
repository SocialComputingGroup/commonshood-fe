import axios from 'axios';

import config from '../../config';


const instanceAuth = axios.create (
    {baseURL:  config.network.loopback.URL}
);

(() => {
    const token = localStorage.getItem('token');
    if (token) {
        instanceAuth.defaults.headers.common['Authorization'] = token;
    } else {
        instanceAuth.defaults.headers.common['Authorization'] = null;
    }
})();

export default instanceAuth