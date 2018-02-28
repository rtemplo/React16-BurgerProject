import axios from 'axios';

//this HOC sets an axios instance wherever it is imported will utilize the same baseURL
const instance = axios.create({
  baseURL: 'https://react16-burgerproject.firebaseio.com/'
});

export default instance;