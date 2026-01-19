import axios from 'axios';

const API = axios.create({
  baseURL: 'https://staffmanagementapi-production.up.railway.app/api', 
});

API.interceptors.request.use((config) => {
    const savedUser = localStorage.getItem("authUser");
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
         if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default API;
