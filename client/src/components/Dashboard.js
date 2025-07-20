import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/surveys');
      setSurveys(response.data);
      setLoading(false);
      setRefreshing(false);
      // Store last refresh time in localStorage
      localStorage.setItem('lastDashboardRefresh', new Date().toISOString());
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setError(
        error.response?.status === 500
          ? 'Server error. Please try again later.'
          : error.response?.status === 404
          ? 'API endpoint not found. Please check server configuration.'
          : 'Failed to load survey data. Please try again later.'
      );
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveys();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchSurveys();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchSurveys]);

  if (loading && !refreshing) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Survey Responses Dashboard</h2>
        </div>
        <div className="card loading-state">
          <div className="loading-spinner"></div>
          <p>Loading survey data...</p>
        </div>
      </div>
    );
  }

  if (error && !refreshing) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Survey Responses Dashboard</h2>
          <div className="refresh-button">
            <button onClick={fetchSurveys}>Retry</button>
          </div>
        </div>
        <div className="card error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Calculate statistics for dashboard
  const calculateStats = () => {
    if (surveys.length === 0) return { avgRecommendation: 0, avgSatisfaction: 0, contactPermissionYes: 0, furtherInfoPermissionYes: 0 };
    
    const avgRecommendation = (surveys.reduce((sum, survey) => sum + parseInt(survey.recommendationRating), 0) / surveys.length).toFixed(1);
    const avgSatisfaction = (surveys.reduce((sum, survey) => sum + parseInt(survey.satisfactionRating), 0) / surveys.length).toFixed(1);
    
    const contactPermissionYes = surveys.filter(survey => 
      survey.contactPermission.includes('Yes')).length;
    
    const furtherInfoPermissionYes = surveys.filter(survey => 
      survey.furtherInfoPermission.includes('Yes')).length;
    
    return { avgRecommendation, avgSatisfaction, contactPermissionYes, furtherInfoPermissionYes };
  };
  
  const stats = calculateStats();
  
  // Function to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = parseInt(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= ratingNum ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Survey Responses Dashboard</h2>
        <div className="refresh-section">
          {localStorage.getItem('lastDashboardRefresh') && (
            <div className="last-refresh">
              Last updated: {new Date(localStorage.getItem('lastDashboardRefresh')).toLocaleTimeString()}
            </div>
          )}
          <div className="refresh-button">
            <button 
              onClick={fetchSurveys} 
              disabled={refreshing}
              className={refreshing ? 'refreshing' : ''}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>
      
      {refreshing && (
        <div className="refresh-indicator">
          <div className="loading-spinner small"></div>
          <span>Updating data...</span>
        </div>
      )}
      
      {surveys.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Survey Responses Yet</h3>
          <p>Survey responses will appear here once customers submit feedback.</p>
        </div>
      ) : (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{surveys.length}</div>
              <div className="stat-label">Total Responses</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.avgRecommendation}</div>
              <div className="stat-label">Avg. Recommendation</div>
              <div className="star-rating">{renderStars(stats.avgRecommendation)}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.avgSatisfaction}</div>
              <div className="stat-label">Avg. Satisfaction</div>
              <div className="star-rating">{renderStars(stats.avgSatisfaction)}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{Math.round((stats.contactPermissionYes / surveys.length) * 100)}%</div>
              <div className="stat-label">Contact Permission</div>
            </div>
          </div>
          
          <h3 className="section-title">Individual Responses</h3>
          <div className="survey-list">
            {surveys.map(survey => (
              <div key={survey._id} className="survey-item">
                <div className="survey-header">
                  <h3>{survey.fullName}</h3>
                  <span className="survey-date">{new Date(survey.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="survey-ratings">
                  <div className="rating-item">
                    <span className="rating-label">Recommendation:</span>
                    <div className="star-rating small">{renderStars(survey.recommendationRating)}</div>
                  </div>
                  
                  <div className="rating-item">
                    <span className="rating-label">Satisfaction:</span>
                    <div className="star-rating small">{renderStars(survey.satisfactionRating)}</div>
                  </div>
                </div>
                
                <div className="survey-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{survey.email}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{survey.phone}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <div className="experience-text">{survey.experience}</div>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Contact Permission:</span>
                    <span className={`permission-value ${survey.contactPermission.includes('Yes') ? 'yes' : 'no'}`}>
                      {survey.contactPermission}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Further Info Permission:</span>
                    <span className={`permission-value ${survey.furtherInfoPermission.includes('Yes') ? 'yes' : 'no'}`}>
                      {survey.furtherInfoPermission}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;