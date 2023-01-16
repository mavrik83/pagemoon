import axios from 'axios';
import http from 'http';
import https from 'https';

const requestConfig = {
    withCredentials: false,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
};

const apiRequest = axios.create(requestConfig);

if (process.env.NODE_ENV === 'development') {
    apiRequest.defaults.baseURL = 'http://localhost:3000';
}

apiRequest.interceptors.response.use(
    (response) => response.data,
    (err) => Promise.reject(err),
);

export { apiRequest };
