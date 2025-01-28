import axios from 'axios'

export const getAgriNews = async (req, res) => {
    const API_KEY = 'bfc4373b16d14533b66b932d0bc5423e'; // Replace with your NewsAPI key
    const BASE_URL = 'https://newsapi.org/v2/everything'; // NewsAPI endpoint for fetching articles
    
    const options = {
      method: 'GET',
      url: BASE_URL,
      params: {
        q: 'agriculture',       // Use 'q' for keywords instead of 'category'
        language: 'en',         // Tamil language code
        pageSize: 10,           // Limit the number of results
        apiKey: API_KEY         // NewsAPI key
      }
    };
  
    try {
      const response = await axios.request(options);
      console.log(response.data);
      res.status(200).json(response.data); // Send response to the client
    } catch (error) {
      console.error('Error fetching news:', error.message);
      res.status(500).json({ error: 'Failed to fetch agriculture news.' });
    }
  };