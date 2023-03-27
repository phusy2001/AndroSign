import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
  baseURL: '',
});

axiosClient.interceptors.request.use(
  async config => {
    // const data = await AsyncStorage.getItem('session');
    // const session = JSON.parse(data);
    // if (session?.accessToken)
    //   config.headers.Authorization = `Bearer ${session?.accessToken}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  function (response) {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async function (error) {
    const config = error?.config;
    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      //   const result = await memoizedRefreshToken();
      //   if (result?.accessToken) {
      //     config.headers = {
      //       authorization: `Bearer ${result?.accessToken}`,
      //     };
      //     return axios(config);
      //   } else {
      //     history.navigate('/');
      //   }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
