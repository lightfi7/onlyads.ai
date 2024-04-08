import axios from 'axios'
import router from '../routes';

const Axios = axios.create({
    // baseURL: 'https://app.onlyads.ai:5000/',
    baseURL: 'http://localhost:5002/',
})

// Add a response interceptor
Axios.interceptors.response.use(
    (response) => {
        // Do something with the response data
        return response;
    },
    (error) => {
        // Handle errors
        if (error.response && error.response.status === 401) {
            window.localStorage.removeItem("@accessToken");
            // Redirect the user to the login page
            window.location.href = '/signin';
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);
export default Axios