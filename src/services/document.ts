import axiosClient from './clients/axios';

const DocumentAPI = {
  getOwnFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/getMyFiles`, {
      params: {offset: pageNumber, keyword, sort, order},
    });
  },

  uploadDocument: async (formData: any) => {
    return await axiosClient.post(`/uploadFile`, formData, {
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    });
  },

  getAnnotations: async (fileId: string) => {
    return await axiosClient.get(`/getXfdf`, {
      params: {id: fileId},
    });
  },

  editDocument: async (
    fileId: string,
    xfdf: string,
    signed: number,
    completed: Boolean,
    step: number,
    user: string,
  ) => {
    return await axiosClient.post(`/editFile`, {
      id: fileId,
      xfdf: xfdf,
      signed,
      completed,
      step,
      user,
    });
  },

  deleteDocument: async (fileId: string) => {
    return await axiosClient.post(`/deleteFile`, {id: fileId});
  },

  getUserShared: async (fileId: string, pageNumber: number) => {
    return await axiosClient.get(`/getUserShared`, {
      params: {id: fileId, offset: pageNumber},
    });
  },

  deleteUserShared: async (fileId: string, userId: string) => {
    return await axiosClient.post(`/deleteShared`, {
      fileId,
      userId,
    });
  },

  addUserShared: async (email: string, fileId: string) => {
    return await axiosClient.post(`/addShared`, {
      email,
      id: fileId,
    });
  },

  createFolder: async (name: string, userId: string) => {
    return await axiosClient.post(`/createFolder`, {
      name,
      user: userId,
    });
  },

  getFolders: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/getFolders`, {
      params: {offset: pageNumber, keyword, sort, order},
    });
  },

  deleteFolder: async (folderId: string) => {
    return await axiosClient.post(`/deleteFolder`, {
      id: folderId,
    });
  },

  getFilesInFolder: async (folderId: string, pageNumber: number) => {
    return await axiosClient.get(`/getFilesInFolder`, {
      params: {id: folderId, offset: pageNumber},
    });
  },

  updateFileInFolder: async (fileId: string, folderId: string) => {
    return await axiosClient.post(`/updateFileInFolder`, {
      fileId,
      folderId,
    });
  },

  getFolderListOfFile: async (fileId: string, pageNumber: number) => {
    return await axiosClient.get(`/getFolderListOfFile`, {
      params: {
        id: fileId,
        offset: pageNumber,
      },
    });
  },

  markFile: async (fileId: string) => {
    return await axiosClient.post(`/markFile`, {
      id: fileId,
    });
  },

  unmarkFile: async (fileId: string) => {
    return await axiosClient.post(`/unmarkFile`, {
      id: fileId,
    });
  },

  getStarredFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/getStarredFiles`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
      },
    });
  },

  getFilesShared: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/getFilesShared`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
      },
    });
  },

  getDeletedFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await axiosClient.get(`/getDeletedFiles`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
      },
    });
  },

  restoreFile: async (id: string) => {
    return await axiosClient.post(`/restoreFile`, {
      id,
    });
  },
};

export default DocumentAPI;
