# Survey Dashboard Application

A full-stack application with a dashboard to visualize survey data from MongoDB. The application uses React for the frontend, Express for the backend, and MongoDB for data storage. It exposes a POST API endpoint for other applications to submit survey data.

## Features

- Dashboard to visualize survey responses with statistics
- POST API endpoint for external applications to submit survey data
- MongoDB integration for data storage
- Responsive design for all device sizes
- Vercel deployment configuration

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source code
│       ├── components/     # React components
│       │   └── Dashboard.js  # Dashboard component for data visualization
│       ├── styles/         # CSS styles
│       │   └── Dashboard.css # Dashboard styling
│       ├── App.js          # Main App component
│       ├── App.css         # App styling
│       └── index.js        # Entry point
├── server.js              # Express server with API endpoints
├── .env                   # Environment variables
├── API_DOCUMENTATION.md   # API documentation for external applications
├── package.json           # Server dependencies
└── vercel.json            # Vercel deployment config
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Installation

1. Clone the repository

2. Install server dependencies
   ```
   npm install
   ```

3. Install client dependencies
   ```
   cd client
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

5. Verify your MongoDB connection
   ```
   node check-mongodb.js
   ```
   This script will:
   - Test your MongoDB connection
   - List all collections in your database
   - Count documents in the 'surveys' collection
   - Display a sample survey (if any exist)

## Running the Application

1. Start the server
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:5000`

The application will automatically serve the React frontend from the server in production mode. In development mode, you can run the client separately:

```
cd client
npm start
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel. For detailed instructions, see the [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md).

Quick start:

1. Install Vercel CLI
   ```
   npm install -g vercel
   ```

2. Login to Vercel
   ```
   vercel login
   ```

3. Set up your MongoDB URI as a secret
   ```
   vercel secrets add mongodb_uri "your_mongodb_connection_string"
   ```

4. Deploy the application
   ```
   vercel
   ```

5. Follow the prompts to complete the deployment

## API Endpoints

- `GET /api/health` - Check the health status of the API and MongoDB connection
- `POST /api/surveys` - Submit a new survey from external applications
- `GET /api/surveys` - Get all survey responses (used by the dashboard)

### Testing the API

#### Database Connection Testing

Verify your MongoDB connection with the included check script:

```
node check-mongodb.js
```

This script will:
- Test your MongoDB connection
- List all collections in your database
- Count documents in the 'surveys' collection
- Display a sample survey (if any exist)

#### Command Line API Testing

A test script is included to verify that your API is working correctly:

```
node test-api.js http://localhost:5000  # For local testing
node test-api.js https://your-vercel-url.vercel.app  # For production testing
```

This script will:
1. Check the health endpoint
2. Submit a test survey
3. Retrieve the list of surveys

#### Browser Testing

A browser-based test form is also included for manual testing:

1. Open `test-form.html` in your browser
2. Update the API URL if needed
3. Fill out the form and submit
4. View the API response at the bottom of the page

#### Comprehensive Testing Approach

For thorough verification of your application, follow this testing sequence:

1. First, verify your MongoDB connection
2. Then, test your API endpoints
3. Finally, test the user interface with the browser form

This three-step approach helps isolate issues between database, API, and frontend components.

For detailed API documentation, see the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file.

## Survey Payload Example

```json
{
  "recommendationRating": "5",
  "satisfactionRating": "4",
  "experience": "I had a great experience with the delivery service. The package arrived on time and in perfect condition.",
  "contactPermission": "Yes, DHL can contact me if clarification is needed.",
  "furtherInfoPermission": "No, I prefer not to receive further information.",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "email": "john.doe@example.com"
}
```

## Dashboard Features

- **Summary Statistics**: View total responses, average ratings, and permission percentages
- **Data Visualization**: Star ratings to visualize customer satisfaction levels
- **Individual Responses**: Detailed view of each survey response
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Refresh button to fetch the latest data