# Survey Dashboard API Documentation

## Overview

This document provides information about the API endpoints available for submitting survey data to the Survey Dashboard application. The application exposes a POST API endpoint that allows other applications to send survey data, which will then be stored in MongoDB and visualized on the dashboard.

## Base URL

### Local Development
```
http://localhost:5000
```

### Production (Vercel)
```
https://your-vercel-url.vercel.app
```

Replace `your-vercel-url` with your actual Vercel deployment URL. After deploying to Vercel, you can find this URL in your Vercel dashboard.

## Authentication

Currently, the API does not require authentication. However, it's recommended to implement authentication in a production environment.

## CORS (Cross-Origin Resource Sharing)

The API is configured to accept requests from the following origins:

- In development: `http://localhost:3000`
- In production: The Vercel deployment URL (e.g., `https://dashboard-survey.vercel.app` and all `.vercel.app` domains)

If you need to make requests from a different origin, you'll need to update the CORS configuration in `server.js`.

## API Endpoints

### Health Check

**Endpoint:** `GET /api/health`

**Description:** Check the health status of the API and its connection to MongoDB.

**Response:**

```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2023-09-01T12:34:56.789Z",
  "mongodb": "connected"
}
```

### Submit Survey Data

**Endpoint:** `POST /api/surveys`

**Description:** Submit a new survey response to be stored in the database and displayed on the dashboard.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**

The request body should be a JSON object with the following fields:

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

**Required Fields:**
- `recommendationRating` (String): Rating from 1-5
- `satisfactionRating` (String): Rating from 1-5
- `experience` (String): Customer's experience description
- `contactPermission` (String): Permission to contact the customer
- `furtherInfoPermission` (String): Permission to send further information
- `fullName` (String): Customer's full name
- `phone` (String): Customer's phone number
- `email` (String): Customer's email address

**Response:**

- **Success Response (201 Created):**
  ```json
  {
    "_id": "60f7b0b3e6b3f32f948a9b1e",
    "recommendationRating": "5",
    "satisfactionRating": "4",
    "experience": "I had a great experience with the delivery service. The package arrived on time and in perfect condition.",
    "contactPermission": "Yes, DHL can contact me if clarification is needed.",
    "furtherInfoPermission": "No, I prefer not to receive further information.",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "email": "john.doe@example.com",
    "createdAt": "2023-07-21T12:34:56.789Z"
  }
  ```

- **Error Response (500 Internal Server Error):**
  ```json
  {
    "error": "Failed to save survey data"
  }
  ```

## Example Usage

### Using cURL

```bash
curl -X POST \
  http://localhost:5000/api/surveys \
  -H 'Content-Type: application/json' \
  -d '{
    "recommendationRating": "5",
    "satisfactionRating": "4",
    "experience": "I had a great experience with the delivery service. The package arrived on time and in perfect condition.",
    "contactPermission": "Yes, DHL can contact me if clarification is needed.",
    "furtherInfoPermission": "No, I prefer not to receive further information.",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "email": "john.doe@example.com"
  }'
```

### Using JavaScript (Fetch API)

```javascript
fetch('http://localhost:5000/api/surveys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    recommendationRating: '5',
    satisfactionRating: '4',
    experience: 'I had a great experience with the delivery service. The package arrived on time and in perfect condition.',
    contactPermission: 'Yes, DHL can contact me if clarification is needed.',
    furtherInfoPermission: 'No, I prefer not to receive further information.',
    fullName: 'John Doe',
    phone: '+1234567890',
    email: 'john.doe@example.com'
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => console.error('Error:', error));
```

### Using Axios (JavaScript)

```javascript
axios.post('http://localhost:5000/api/surveys', {
  recommendationRating: '5',
  satisfactionRating: '4',
  experience: 'I had a great experience with the delivery service. The package arrived on time and in perfect condition.',
  contactPermission: 'Yes, DHL can contact me if clarification is needed.',
  furtherInfoPermission: 'No, I prefer not to receive further information.',
  fullName: 'John Doe',
  phone: '+1234567890',
  email: 'john.doe@example.com'
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

- **400 Bad Request**: When the request body is missing required fields or contains invalid data.
- **500 Internal Server Error**: When there's a server-side error, such as a database connection issue.

## Data Visualization

All submitted survey data will be automatically displayed on the dashboard, which shows:

1. Summary statistics (total responses, average ratings, etc.)
2. Individual survey responses with detailed information

The dashboard automatically refreshes when new data is submitted, or you can manually refresh it using the "Refresh Data" button.