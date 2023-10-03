import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

import {signout} from '../auth';
import {getData, storeData} from '../../utils/asyncStore';
import {navigate} from '../../navigation/RootNavigation';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
class AxiosClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      async config => {
        // Add authorization header or modify request before it is sent
        const user = auth().currentUser;

        // Get the idTokenResult
        user
          ?.getIdTokenResult()
          .then(idTokenResult => {
            const now = Date.now();
            const exp = new Date(idTokenResult.expirationTime);
            const expiresIn = exp.getTime() - now;

            if (expiresIn < 15 * 60 * 1000) {
              user
                .getIdToken(true)
                .then(async idToken => {
                  await storeData('userToken', idToken);
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            // Handle error
          });

        const token = await getData('userToken');

        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        // Handle request error
        console.error(error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Modify response data before it is returned

        return response.data;
      },
      async (error: AxiosError) => {
        // Handle response error
        console.error(error);

        if (error.response?.status === 401 || error.response?.status === 500) {
          await signout();
          navigate('Login', {});
          Toast.show({
            text1: 'Bạn đã hết phiên đăng nhập',
            type: 'info',
            position: 'bottom',
          });
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response as T;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response as T;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response as T;
  }

  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response as T;
  }
}

export default AxiosClient;
