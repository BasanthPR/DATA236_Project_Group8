// // src/services/customerService.ts
// import axios from 'axios';
// import { CustomerProfile } from '@/types/customer';

// // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4006';

// // Get the auth token from localStorage
// const getAuthToken = () => localStorage.getItem('token');

// // Configure axios with auth headers
// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to every request
// api.interceptors.request.use(config => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const customerService = {
//   /**
//    * Get the current customer profile
//    */
//   getCustomerProfile: async (): Promise<CustomerProfile> => {
//     try {
//       const response = await api.get('/customers');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer profile:', error);
//       throw error;
//     }
//   },

//   /**
//    * Create a new customer profile
//    */
//   createCustomerProfile: async (profileData: Partial<CustomerProfile>): Promise<CustomerProfile> => {
//     try {
//       const response = await api.post('/customers', profileData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating customer profile:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update an existing customer profile
//    */
//   updateCustomerProfile: async (profileData: Partial<CustomerProfile>): Promise<CustomerProfile> => {
//     try {
//       const response = await api.put('/customers', profileData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating customer profile:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get customer reviews
//    */
//   getCustomerReviews: async () => {
//     try {
//       const response = await api.get('/customer-reviews/my-reviews');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer reviews:', error);
//       throw error;
//     }
//   }
// };

// src/services/customerService.ts
import axios from 'axios';
import { CustomerProfile } from '@/types/customer';

const CUSTOMER_PORT = import.meta.env.VITE_CUSTOMER_SERVICE_PORT;
const API_URL = `http://localhost:${CUSTOMER_PORT}/api/customers`;

// Log API URL for debugging
console.log('Customer Service API URL:', API_URL);

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Configure axios with auth headers
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(config => {
  const token = getAuthToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  error => {
    console.error('API Error:', 
      error.response ? {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      } : error.message
    );
    return Promise.reject(error);
  }
);

export const customerService = {
  /**
   * Get the current customer profile
   */
  getCustomerProfile: async (): Promise<CustomerProfile> => {
    try {
      console.log('Fetching customer profile...');
      const response = await api.get('/customers');
      console.log('Customer profile fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      
      // Get user data from localStorage as fallback for UI display
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.email) {
          console.log('Using localStorage userData as fallback');
          return {
            isNewProfile: true,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email,
            rating: 0,
            ridesHistory: []
          };
        }
      } catch (e) {
        console.error('Error parsing userData from localStorage:', e);
      }
      
      throw error;
    }
  },

  /**
   * Create a new customer profile
   */
  createCustomerProfile: async (profileData: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      console.log('Creating customer profile:', profileData);
      const response = await api.post('/customers', profileData);
      console.log('Customer profile created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer profile:', error);
      throw error;
    }
  },

  /**
   * Update an existing customer profile
   */
  updateCustomerProfile: async (profileData: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      console.log('Updating customer profile:', profileData);
      const response = await api.put('/customers', profileData);
      console.log('Customer profile updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  },

  /**
   * Get customer reviews
   */
  getCustomerReviews: async () => {
    try {
      const response = await api.get('/customer-reviews/my-reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer reviews:', error);
      return { reviews: [] };
    }
  }
};