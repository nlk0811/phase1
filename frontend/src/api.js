import axios from 'axios';

const API_URL = 'http://127.0.0.1:8081'; // Replace with your Flask backend URL



/**
 * Registers a new user with the provided username, email, and password.
 * @param {string} username - The username of the new user.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} The error response from the server or a network error.
 */
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,  // Add the username parameter
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};


/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} The error response from the server or a network error.
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};


/**
 * Generates an itinerary based on the provided budget, interests, duration, and source.
 * @param {number} budget - The budget for the trip.
 * @param {string} interests - The interests of the user, separated by commas.
 * @param {number} duration - The duration of the trip in days.
 * @param {string} source - The starting location of the trip.
 * @returns {Promise<Object>} The generated itinerary from the server.
 * @throws {Error} The error response from the server or a network error.
 */
export const generateItinerary = async (budget, interests, duration, source) => {
  try {
    const response = await axios.post(`${API_URL}/generate-itinerary`, {
      budget: parseInt(budget),
      interests: interests.split(',').map(interest => interest.trim()),
      duration: parseInt(duration),
      source
    });
    return response.data.itinerary;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};


/**
 * Generates an itinerary based on the provided budget, interests, duration, and source.
 * @param {number} budget - The budget for the trip.
 * @param {string} interests - The interests of the user, separated by commas.
 * @param {number} duration - The duration of the trip in days.
 * @param {string} source - The starting location of the trip.
 * @param {string} requests - The requests of the user
 * @returns {Promise<Object>} The generated itinerary from the server.
 * @throws {Error} The error response from the server or a network error.
 */
export const generateItineraryWithRequests = async (budget, interests, duration, source, requests) => {
  try {
    const response = await axios.post(`${API_URL}/generate-itinerary-with-requests`, {
      budget: parseInt(budget),
      interests: interests.split(',').map(interest => interest.trim()),
      duration: parseInt(duration),
      source,
      requests
    });
    return response.data.itinerary;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};



/**
 * Generates an itinerary based on the provided budget, interests, duration, source, and destination.
 * @param {number} budget - The budget for the trip.
 * @param {string} interests - The interests of the user, separated by commas.
 * @param {number} duration - The duration of the trip in days.
 * @param {string} source - The starting location of the trip.
 * @param {string} destination - The destination location of the trip.
 * @returns {Promise<Object>} The generated itinerary from the server.
 * @throws {Error} The error response from the server or a network error.
 */
export const generateItineraryWithDestination = async (budget, interests, duration, source, destination) => {
  try {
    const response = await axios.post(`${API_URL}/generate-itinerary-with-destination`, {
      budget: parseInt(budget),
      interests: interests.split(',').map(interest => interest.trim()),
      duration: parseInt(duration),
      source,
      destination
    });
    return response.data.itinerary;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/** 
* Generates an itinerary based on the provided budget, interests, duration, source, and destination.
* @param {number} budget - The budget for the trip.
* @param {string} interests - The interests of the user, separated by commas.
* @param {number} duration - The duration of the trip in days.
* @param {string} source - The starting location of the trip.
* @param {string} destination - The destination location of the trip.
* @param {string} requests - The requests of the user
* @returns {Promise<Object>} The generated itinerary from the server.
* @throws {Error} The error response from the server or a network error.
*/
export const generateItineraryWithDestinationAndRequests = async (budget, interests, duration, source, destination, requests) => {
 try {
   const response = await axios.post(`${API_URL}/generate-itinerary-with-destination-and-requests`, {
     budget: parseInt(budget),
     interests: interests.split(',').map(interest => interest.trim()),
     duration: parseInt(duration),
     source,
     destination,
     requests
   });
   return response.data.itinerary;
 } catch (error) {
   throw error.response ? error.response.data : new Error('Network error');
 }
};

/**
 * Fetches a list of places based on the provided location name and type.
 * @param {string} location_name - The name of the location to search for places.
 * @param {string} type - The type of place to search for (e.g., restaurant, park).
 * @returns {Promise<Object[]>} A list of places matching the search criteria.
 * @throws {Error} The error response from the server or a network error.
 */
export const getPlaces = async (location_name, type) => {
  try {
    const response = await axios.get(`${API_URL}/get-places`, {
      params: {
        location_name,
        type
      }
    });
    return response.data.results;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Fetches the weather data for the provided location.
 * @param {string} location - The name of the location to get weather data for.
 * @returns {Promise<Object>} The weather data for the specified location.
 * @throws {Error} The error response from the server or a network error.
 */
export const getWeather = async (location) => {
    try {
      const response = await axios.get(`${API_URL}/get-weather`, {
        params: {
          location
        }
      });
      return response.data; // Return the weather data
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };

/**
 * Fetches the weather data for the provided destination location.
 * @param {string} location - The name of the destination location to get weather data for.
 * @returns {Promise<Object>} The weather data for the specified destination location.
 * @throws {Error} The error response from the server or a network error.
 */
export const getDestinationWeather = async (location) => {
    try {
      const response = await axios.get(`${API_URL}/get-destination-weather`, {
        params: { location },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };


  /**
 * Fetches user information based on the provided email.
 * @param {string} email - The email of the user to retrieve information for.
 * @returns {Promise<Object>} The user information from the server.
 * @throws {Error} The error response from the server or a network error.
 */
  export const getUserInfo = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/user-info`, {
        params: {
          email: email
        }
      });
      return response.data.user;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };

/**
 * Saves the provided itinerary data to the server.
 * @param {Object} itineraryData - The data of the itinerary to be saved.
 * @returns {Promise<Object>} The response data from the server confirming the save.
 * @throws {Error} The error response from the server or a network error.
 */
  export const saveItinerary = async (itineraryData) => {
    try {
      const response = await axios.post(`${API_URL}/save-itinerary`, itineraryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };


/**
 * Fetches the itineraries saved by the user with the provided email.
 * @param {string} email - The email of the user to fetch itineraries for.
 * @returns {Promise<Object[]>} A list of saved itineraries for the user.
 * @throws {Error} The error response from the server or a network error.
 */
  export const fetchItineraries = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/fetch-itineraries`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };