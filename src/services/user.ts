import AxiosClient from './clients/api';

const client = new AxiosClient('http://10.0.2.2:3005');

const service = 'users';

const UserAPI = {
  findUserByEmail: async (email: string) => {
    return await client.get(`/${service}/email/${email}`);
  },
};

export default UserAPI;
