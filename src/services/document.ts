import AxiosClient from './clients/api';

const client = new AxiosClient('http://10.0.2.2:3001');

const DocumentAPI = {
  getOwnFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
    status: string,
  ) => {
    return await client.get(`/getMyFiles`, {
      params: {offset: pageNumber, keyword, sort, order, status},
    });
  },

  uploadDocument: async (formData: any) => {
    return await client.post(`/uploadFile`, formData, {
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    });
  },

  getAnnotations: async (fileId: string) => {
    return await client.get(`/getXfdf`, {
      params: {id: fileId},
    });
  },

  editDocument: async (
    fileId: string,
    xfdf: string,
    signed: number,
    step: number,
    user: string,
  ) => {
    return await client.post(`/editFile`, {
      id: fileId,
      xfdf,
      signed,
      step,
      user,
    });
  },

  deleteDocument: async (fileId: string) => {
    return await client.post(`/deleteFile`, {id: fileId});
  },

  getUserShared: async (fileId: string, pageNumber: number) => {
    return await client.get(`/getUserShared`, {
      params: {id: fileId, offset: pageNumber},
    });
  },

  deleteUserShared: async (fileId: string, userId: string) => {
    return await client.post(`/deleteShared`, {
      fileId,
      userId,
    });
  },

  addUserShared: async (email: string, fileId: string) => {
    return await client.post(`/addShared`, {
      email,
      id: fileId,
    });
  },

  createFolder: async (name: string, userId: string) => {
    return await client.post(`/createFolder`, {
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
    return await client.get(`/getFolders`, {
      params: {offset: pageNumber, keyword, sort, order},
    });
  },

  deleteFolder: async (folderId: string) => {
    return await client.post(`/deleteFolder`, {
      id: folderId,
    });
  },

  getFilesInFolder: async (folderId: string, pageNumber: number) => {
    return await client.get(`/getFilesInFolder`, {
      params: {id: folderId, offset: pageNumber},
    });
  },

  updateFileInFolder: async (fileId: string, folderId: string) => {
    return await client.post(`/updateFileInFolder`, {
      fileId,
      folderId,
    });
  },

  getFolderListOfFile: async (fileId: string, pageNumber: number) => {
    return await client.get(`/getFolderListOfFile`, {
      params: {
        id: fileId,
        offset: pageNumber,
      },
    });
  },

  markFile: async (fileId: string) => {
    return await client.post(`/markFile`, {
      id: fileId,
    });
  },

  unmarkFile: async (fileId: string) => {
    return await client.post(`/unmarkFile`, {
      id: fileId,
    });
  },

  getStarredFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
    status: string,
  ) => {
    return await client.get(`/getStarredFiles`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
        status,
      },
    });
  },

  getFilesShared: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
    status: string,
  ) => {
    return await client.get(`/getFilesShared`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
        status,
      },
    });
  },

  getDeletedFiles: async (
    pageNumber: number,
    keyword: string,
    sort: string,
    order: string,
  ) => {
    return await client.get(`/getDeletedFiles`, {
      params: {
        offset: pageNumber,
        keyword,
        sort,
        order,
      },
    });
  },

  restoreFile: async (id: string) => {
    return await client.post(`/restoreFile`, {
      id,
    });
  },

  deletePermanently: async (id: string) => {
    return await client.post(`/deletePermanently`, {
      id,
    });
  },

  getFileHistory: async (id: string, pageNumber: number) => {
    return await client.get(`/getFileHistory`, {
      params: {
        id,
        offset: pageNumber,
      },
    });
  },

  renameDocument: async (id: string, name: string) => {
    return await client.post(`/renameFile`, {
      id,
      name,
    });
  },
};

export default DocumentAPI;
