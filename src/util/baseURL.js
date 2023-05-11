import axios from 'axios';

export const axiosURL = axios.create({
  baseURL: 'https://eml.tulieservices.org/server/wp-json/wp/v2',
});