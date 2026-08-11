import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api',
    timeout: 10_000,
});

export default http;
