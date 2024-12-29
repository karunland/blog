/**
 * @typedef {Object} BlogPost
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} slug
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} authorName
 */

/**
 * @typedef {Object} BlogResponse
 * @property {number} page
 * @property {number} count
 * @property {boolean} isSuccess
 * @property {BlogPost[]} data
 * @property {string[]} errors
 */

/**
 * @typedef {Object} Category
 * @property {string} name
 * @property {number} id
 * @property {string} createdAt
 * @property {number} blogsCount
 */

/**
 * @typedef {Object} CategoryResponse
 * @property {number} page
 * @property {number} count
 * @property {boolean} isSuccess
 * @property {Category[]} data
 * @property {string[]} errors
 */

/**
 * @typedef {Object} Stats
 * @property {number} blogCount
 * @property {number} categoryCount
 * @property {number} commentCount
 */

/** @type {BlogPost} */
export const BlogPost = {
  id: 0,
  title: '',
  content: '',
  slug: '',
  createdAt: '',
  updatedAt: '',
  authorName: ''
}

/** @type {BlogResponse} */
export const BlogResponse = {
  page: 0,
  count: 0,
  isSuccess: false,
  data: [],
  errors: []
} 