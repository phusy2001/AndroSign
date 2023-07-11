import AxiosClient from './clients/api';
import Config from 'react-native-config';

const client = new AxiosClient(`${Config.API_URL}:3005`);

const service = 'users';

const UserAPI = {
  findUserByEmail: async (email: string) => {
    return await client.get(`/${service}/email/${email}`);
  },

  findUserByUid: (uid: string | undefined) => {
    return client.get(`/${service}/${uid}`);
  },

  updateUserByUid(uid: string, body: any) {
    return client.put(`/${service}/${uid}`, body);
  },

  deleteUserByUid(uid: string) {
    return client.delete(`/${service}/${uid}`);
  },

  createUser(body: any) {
    return client.post(`${service}`, body);
  },

  removeFcmToken(body: any) {
    return client.post(`${service}/remove-fcm-token`, body);
  },

  createCaPassword(uid: string, body: any) {
    return client.put(`${service}/${uid}/createUserCa`, body);
  },

  updateCaPassword(uid: string, body: any) {
    return client.put(`${service}/${uid}/updateUserCa`, body);
  },

  getUserCreatedDate: (uid: string | undefined) => {
    return client.get(`/${service}/${uid}/get-created-date`);
  },
};

export default UserAPI;
