import axiosClient from './clients/axios';

const service = 'document';

const DocumentAPI = {
  getOwnFile: async (pageNumber: number) => {
    return await axiosClient.get(`/${service}/getMyFiles`, {
      params: {offset: pageNumber},
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
};

export default DocumentAPI;
