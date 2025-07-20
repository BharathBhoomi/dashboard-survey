# Vercel Deployment Guide

This guide will help you deploy the Survey Dashboard application to Vercel with the proper configuration for MongoDB integration.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (`npm install -g vercel`)
3. A MongoDB Atlas account with a cluster set up

## Setting Up Environment Variables in Vercel

### Option 1: Using Vercel Dashboard

1. Log in to your Vercel dashboard
2. Create a new project or select your existing project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add the following environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/surveys?retryWrites=true&w=majority`)
6. Click "Save"

### Option 2: Using Vercel CLI

1. Create a secret for your MongoDB URI:
   ```
   vercel secrets add mongodb_uri "your_mongodb_connection_string"
   ```

2. The `vercel.json` file in this project is already configured to use this secret.

## Deployment Steps

### Option 1: Deploy from Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel dashboard
3. Click "New Project"
4. Import your repository
5. Configure the project:
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
   - Install Command: `npm install`
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Open a terminal in the root directory of your project
2. Run the following command:
   ```
   vercel
   ```
3. Follow the prompts to complete the deployment

## Verifying the Deployment

1. Once deployed, Vercel will provide you with a URL for your application
2. Visit the URL to ensure the dashboard is working correctly
3. Check the health of your API by visiting `https://your-vercel-url.vercel.app/api/health`
4. Verify that the MongoDB connection is showing as "connected" in the health check response
5. Test the API endpoint by sending a POST request to `https://your-vercel-url.vercel.app/api/surveys` with the survey data

### Using the Test Script

A test script is included to verify that your API is working correctly after deployment:

```
node test-api.js https://your-vercel-url.vercel.app
```

This script will:
1. Check the health endpoint
2. Submit a test survey
3. Retrieve the list of surveys

If all tests pass, your API is working correctly.

**Comprehensive Testing Approach:**

For thorough verification of your deployment, use both test scripts:

1. First, verify your MongoDB connection:
   ```
   node check-mongodb.js
   ```

2. Then, test your API endpoints:
   ```
   node test-api.js https://your-vercel-url.vercel.app
   ```

This two-step approach helps isolate whether issues are with the database connection or with the API implementation.

### Using the Test Form

A browser-based test form is also included to manually test the API:

1. Open the `test-form.html` file in your browser
2. Update the API URL field to your Vercel deployment URL (e.g., `https://your-vercel-url.vercel.app/api/surveys`)
3. Fill out the form and submit
4. Check the response at the bottom of the page

This form provides a user-friendly way to test the API without writing code.

## Exposing the MongoDB Endpoint

The API endpoint for saving data to MongoDB is automatically exposed at:

```
https://your-vercel-url.vercel.app/api/surveys
```

You can use this endpoint to submit survey data from external applications. Refer to the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file for details on the required payload format and examples.

## Troubleshooting

### MongoDB Connection Issues

1. Ensure your MongoDB Atlas cluster is properly configured to accept connections from any IP address (or specifically from Vercel's IP ranges)
2. Verify that your MongoDB connection string is correct and includes the database name (`surveys`)
3. Check the Vercel logs for any connection errors
4. Use the included MongoDB connection check script to verify your connection locally:
   ```
   node check-mongodb.js
   ```
   This script will:
   - Test the connection to your MongoDB database
   - List the collections in the database
   - Count the number of survey documents
   - Show a sample survey if available

   **Interpreting the results:**
    - If you see "✅ MongoDB connected successfully", your connection string is working correctly
    - If you see "❌ MongoDB connection error", check your connection string and network settings
    - If no collections are found, this is normal for a new database
    - If the 'surveys' collection is not found, it will be created when the first survey is submitted
    - If you see sample survey data, your database is properly populated
    
    **Resolving common MongoDB issues:**
    - **Connection timeout**: Check if your IP address is whitelisted in MongoDB Atlas Network Access settings
    - **Authentication failed**: Verify username and password in your connection string
    - **Empty database**: If expected collections are missing, ensure you're connecting to the correct database
    - **Cannot connect from Vercel**: Add `0.0.0.0/0` to your MongoDB Atlas IP whitelist to allow connections from any IP

### API Endpoint Not Working

1. Verify that the routes in `vercel.json` are correctly configured
2. Check the Vercel logs for any errors
3. Ensure that your MongoDB connection is working by checking the `/api/health` endpoint
4. Run the MongoDB connection check script locally to compare with production:
   ```
   node check-mongodb.js
   ```
5. If the script works locally but the API fails in production, check:
   - That your Vercel environment variables are correctly set
   - That your MongoDB Atlas IP whitelist includes Vercel's IP ranges
   - That your server.js file is properly handling the MongoDB connection in production

### Client-Side Issues

1. Make sure the client build was successful
2. Check for any CORS issues if you're accessing the API from a different domain
3. Verify that the client is correctly configured to use the API endpoint

## Updating Your Deployment

When you make changes to your application, you can update your Vercel deployment by:

1. Pushing changes to your Git repository (if using Git integration)
2. Running `vercel` again from the command line

Vercel will automatically rebuild and redeploy your application.