import axios from 'axios';

var api = axios.create({baseUrl:"http://localhost:8888"});

export default api;