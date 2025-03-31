/*
    These services are the only files that make API calls. Stores should create wrapper functions
    to these service functions, and error handling should be done in the top-level components
 */
import type { AxiosInstance } from 'axios';
import axios from 'axios';

export const API: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});
