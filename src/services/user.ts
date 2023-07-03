import AxiosClient from './clients/api';

const client = new AxiosClient('http://10.0.2.2:3005');

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
};

export default UserAPI;
