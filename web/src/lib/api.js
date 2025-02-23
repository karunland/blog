import axios from 'axios';
import toastr from 'toastr';
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getBlogsByCategory = async (params) => {
  try {
    const response = await api.get('/blog/list', { 
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blogs By Category Error:', error.response?.data || error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getBestBlogs = async () => {
  try {
    const response = await api.get('/blog/list', {
      params: {
        sortBy: 2
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blogs Error:', error.response?.data || error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await api.get('/Category/List');
    return response.data;
  } catch (error) {
    console.error('Get Categories Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`/blog/detail?slug=${slug}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getBlogPosts = async () => {
  try {
    const response = await api.get('/user/Blogs', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Blog Posts Error:', error);
    toastr.error(error.response.data.errorMessage);
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
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await api.post('/blog/create', blogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    toastr.error(error.response.data.errorMessage);
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
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getBlogDetail = async (id) => {
  try {
    const response = await api.get(`/blog/detail?slug=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const updateBlog = async (data) => {
  try {
    const response = await api.post('/blog/update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const searchBlogs = async (search) => {
  try {
    const response = await api.get(`/blog/search?search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    console.error('Search Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const googleRegister = async (credential) => {
  try {
    const response = await api.post('/user/googleRegister', credential);
    return response.data;
  } catch (error) {
    console.error('Google Register Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await api.post('/user/googleLogin', credential);
    return response.data;
  } catch (error) {
    console.error('Google Login Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const verifyEmail = async (code) => {
  try {
    const response = await api.post(`/user/verifyEmail`, { credential: code }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Verify Code Error:', error);
    toastr.error(error.response.data.errorMessage);
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
    toastr.error(error.response.data.errorMessage);
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
    toastr.error(error.response.data.errorMessage);
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
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const sendVerificationCode = async () => {
  try {
    const response = await api.post('/user/SendVerificationCode', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Send Verification Code Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/user/login', data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data?.error?.errorMessage || 'Giriş yapılırken bir hata oluştu');
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const getComments = async (blogSlug, page = 1, pageSize = 100) => {
  try {
    const response = await api.get(`/comment/List?blogSlug=${blogSlug}&pageNumber=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Comments Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const addComment = async (data) => {
  try {
    const response = await api.post('/comment/create', data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Add Comment Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await api.delete(`/Comment/Delete?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Delete Comment Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

//changeBlogStatus
export const changeBlogStatus = async (slug, status) => {
  try {
    const response = await api.post(`/blog/changeStatus`, {
      slug,
      status
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Change Blog Status Error:', error);
    toastr.error(error.response.data.errorMessage);
    throw error;
  }
};

export const likeBlog = async (slug) => {
  try {
    const response = await api.post('/blog/like', {
      slug,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    toastr.error(error.response.data.errorMessage);
    console.error('Like Blog Error:', error);
    throw error;
  }
};

export default api;
