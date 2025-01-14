import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getBlogsByCategory = async (params) => {
  try {
    const response = await api.get('/blog/list', { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blogs By Category Error:', error.response?.data || error);
    throw error;
  }
};

export const getBestBlogs = async () => {
  try {
    await sleep(1000);
    const response = await api.get('/blog/list', {
      params: {
        sortBy: 2
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blogs Error:', error.response?.data || error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get('/Category/List');
    return response.data;
  } catch (error) {
    console.error('Get Categories Error:', error);
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`/blog/detail?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    await sleep(1000);
    const response = await api.get('/user/Blogs', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blog Posts Error:', error);
    throw error;
  }
};

export const register = async (formData) => {
  try {
    const response = await api.post('/user/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await api.post('/blog/create', blogData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create Blog Error:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    await sleep(1000);
    const response = await api.get('/dashboard/getStats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    throw error;
  }
};

// /category/categories
export const getCategories = async () => {
  try {
    const response = await api.get('/category/categories');
    return response.data;
  } catch (error) {
    console.error('Get Categories Error:', error);
    throw error;
  }
};

export const deleteBlog = async (slug) => {
  try {
    const response = await api.post(`/blog/delete?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const getBlogDetail = async (id) => {
  try {
    const response = await api.get(`/blog/detail?slug=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    throw error;
  }
};

export const updateBlog = async (id, data) => {
  try {
    const response = await api.post(`/blog/update/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const searchBlogs = async (search) => {
  try {
    await sleep(1000);
    const response = await api.get(`/blog/search?search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};

export const googleRegister = async (credential) => {
  try {
    const response = await api.post('/user/googleRegister', credential);
    return response.data;
  } catch (error) {
    console.error('Google Register Error:', error);
    throw error;
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await api.post('/user/googleLogin', credential);
    return response.data;
  } catch (error) {
    console.error('Google Login Error:', error);
    throw error;
  }
};

export const verifyEmail = async (code) => {
  try {
    const response = await api.post(`/user/verifyEmail`, code, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Verify Code Error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Me Error:', error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.post('/user/update', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Profile Error:', error);
    throw error;
  }
};

export const updateProfilePhoto = async (data) => {
  try {
    const response = await api.post('/user/updateProfilePhoto', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Profile Photo Error:', error);
    throw error;
  }
};

export const sendVerificationCode = async () => {
  try {
    const response = await api.post('/user/sendVerification', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Send Verification Code Error:', error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/user/login', data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data?.error?.errorMessage || 'Giriş yapılırken bir hata oluştu');
    throw error;
  }
};

export default api;
