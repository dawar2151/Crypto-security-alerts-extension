import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/alerts-entries'; // Replace with your actual API base URL

// Function to save a user
export const saveUser = async (user: { email: string; mobilePhone: string; address: string }) => {
  try {
    const response = await axios.post(API_BASE_URL, user);
    return response.data;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
