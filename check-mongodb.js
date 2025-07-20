// Script to check MongoDB connection status
// Run with: node check-mongodb.js

require('dotenv').config();
const mongoose = require('mongoose');

// Get MongoDB URI from environment variable or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhboomis:nPCJggIkHu1sYMF8@cluster0.9ezpy0a.mongodb.net/surveys?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

console.log('Checking MongoDB connection...');
console.log(`MongoDB URI: ${MONGODB_URI.split('@')[0].replace(/:[^:]*$/, ':****')}@${MONGODB_URI.split('@')[1]}`);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Check database information
    const db = mongoose.connection.db;
    
    // Get collection names
    db.listCollections().toArray()
      .then(collections => {
        console.log('\nCollections in database:');
        if (collections.length === 0) {
          console.log('No collections found');
        } else {
          collections.forEach(collection => {
            console.log(`- ${collection.name}`);
          });
        }
        
        // Check for Survey collection and count documents
        if (collections.some(c => c.name === 'surveys')) {
          db.collection('surveys').countDocuments()
            .then(count => {
              console.log(`\nNumber of survey documents: ${count}`);
              
              // If there are surveys, show a sample
              if (count > 0) {
                db.collection('surveys').find().limit(1).toArray()
                  .then(surveys => {
                    console.log('\nSample survey:');
                    console.log(JSON.stringify(surveys[0], null, 2));
                    closeConnection();
                  })
                  .catch(err => {
                    console.error('Error fetching sample survey:', err);
                    closeConnection();
                  });
              } else {
                closeConnection();
              }
            })
            .catch(err => {
              console.error('Error counting documents:', err);
              closeConnection();
            });
        } else {
          console.log('\nSurvey collection not found. It will be created when the first survey is submitted.');
          closeConnection();
        }
      })
      .catch(err => {
        console.error('Error listing collections:', err);
        closeConnection();
      });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Function to close the connection
function closeConnection() {
  console.log('\nClosing MongoDB connection...');
  mongoose.connection.close()
    .then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
}

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close()
    .then(() => {
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
});