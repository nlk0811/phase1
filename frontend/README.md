# Musafir Frontend

This is the frontend for the Musafir web application, built using React. The application provides users with a personalized travel itinerary generator, complete with user authentication, itinerary creation, and saving features.

## Features

- User authentication with Firebase.
- Dynamic travel itinerary generation.
- Real-time weather updates for travel destinations.
- Integration with the Musafir backend for saving and retrieving itineraries.
- Responsive design with a clean user interface.

## Requirements

- Node.js (version 14 or higher)
- React (via Create React App)
- Firebase project for authentication
- Backend API (Flask) running and accessible

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/musafir-frontend.git
   cd musafir-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root and add the following:

   ```env
   REACT_APP_API_URL=http://127.0.0.1:5000  # Backend API URL
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Run the application**

   ```bash
   npm start
   ```

   The application should now be running on `http://localhost:3000`.

## Project Structure

- **`/src`**: Contains all source code, including components, pages, and utility functions.
  - **`/components`**: Reusable components such as buttons, forms, and modals.
  - **`/pages`**: Main pages like Home, Profile, Login, Register, and Itinerary.
  - **`/api`**: API functions for interacting with the backend.
- **`/public`**: Public assets such as images and the HTML template.

## Deployment

The frontend can be deployed to platforms like Vercel, Netlify, or GitHub Pages. Ensure that the environment variables are set correctly in your deployment platform.

### Steps for Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

   This will create an optimized production build in the `build` directory.

2. **Deploy the build directory** to your chosen platform.

   Follow the specific instructions for the platform you're using to deploy the static files in the `build` directory.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request.


