import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://10.0.2.2:3005',
});

const UserAPI = {
  findUserByEmail: async (email: string) => {
    return await axiosClient.get(`/email/${email}`);
  },
};

export default UserAPI;
