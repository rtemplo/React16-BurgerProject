import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react16-burgerproject.firebaseio.com/'
});

export default instance;