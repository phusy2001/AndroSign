import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

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
        if (config.headers) {
          config.headers.Authorization = `Bearer ${await AsyncStorage.getItem(
            'token',
          )}`;
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
      (error: AxiosError) => {
        // Handle response error
        console.error(error);
        return Promise.reject(error);
      },
    );
  }

  async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export default AxiosClient;
