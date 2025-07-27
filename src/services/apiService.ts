import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Base API URL (Update this to your API's base URL)
// process.env.REACT_APP_API_URL || 
const BASE_URL = "https://d1dgpoid6t01jm.cloudfront.net/admin";

// Function to get the token (Modify as per your auth storage)
const getToken = (): string | null => {
  return localStorage.getItem("token"); // Adjust storage method if needed
};

// Create Axios instance
const apiService: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically adds Authorization header
apiService.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles API responses & errors globally
apiService.interceptors.response.use(
  (response: AxiosResponse) => response, // Simply return the response
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error?.response?.data || error.message);
  }
);

// Generic GET request
export const get = async <T>(url: string, params?: object): Promise<T> => {
  const response = await apiService.get<T>(url, { params });
  return response.data;
};

// Generic POST request
export const post = async <T>(url: string, data?: object): Promise<T> => {
  const response = await apiService.post<T>(url, data);
  return response.data;
};

// Generic PUT request
export const put = async <T>(url: string, data?: object): Promise<T> => {
  const response = await apiService.put<T>(url, data);
  return response.data;
};

// Generic PATCH request (NEWLY ADDED)
export const patch = async <T>(url: string, data?: object): Promise<T> => {
  debugger;
  const response = await apiService.patch<T>(url, data);
  return response.data;
};

// Generic DELETE request
export const del = async <T>(url: string): Promise<T> => {
  const response = await apiService.delete<T>(url);
  return response.data;
};

export default apiService;
