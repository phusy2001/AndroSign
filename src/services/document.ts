import axiosClient from './clients/axios';

const service = 'document';

const DocumentAPI = {
  getOwnFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/${service}/getMyFiles`, {
      params: {offset: pageNumber, keyword, sort, order},
    });
  },

  uploadDocument: async (formData: any) => {
    return await axiosClient.post(`/${service}/uploadFile`, formData, {
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    });
  },

  getAnnotations: async (fileId: string) => {
    return await axiosClient.get(`/${service}/getXfdf`, {
      params: {id: fileId},
    });
  },

  editDocument: async (fileId: string, xfdf: string) => {
    return await axiosClient.post(`/${service}/editFile`, {
      id: fileId,
      xfdf: xfdf,
    });
  },

  deleteDocument: async (fileId: string) => {
    return await axiosClient.post(`/${service}/deleteFile`, {id: fileId});
  },

  getUserShared: async (fileId: string, pageNumber: number) => {
    return await axiosClient.get(`/${service}/getUserShared`, {
      params: {id: fileId, offset: pageNumber},
    });
  },

  deleteUserShared: async (fileId: string, userId: string) => {
    return await axiosClient.post(`/${service}/deleteShared`, {
      fileId,
      userId,
    });
  },

  addUserShared: async (email: string, fileId: string) => {
    return await axiosClient.post(`/${service}/addShared`, {
      email,
      id: fileId,
    });
  },
};

export default DocumentAPI;
