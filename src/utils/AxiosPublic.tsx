import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: '',
  headers: {'content-type': 'application/json'},
});
