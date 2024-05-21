import axios from 'axios';

export const fetchTopSearches = async () => {
  const response = await axios.get('/api/top-searches');
  return response.data;
};
