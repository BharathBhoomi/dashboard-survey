import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SurveyForm.css';

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    recommendationRating: '',
    satisfactionRating: '',
    experience: '',
    contactPermission: '',
    furtherInfoPermission: '',
    fullName: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Validate field on change
    validateField(name, value);
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errorMessage = 'Full name is required';
        } else if (value.trim().length < 2) {
          errorMessage = 'Name must be at least 2 characters';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          errorMessage = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
        if (!value.trim()) {
          errorMessage = 'Phone number is required';
        }
        break;
        
      case 'experience':
        if (!value.trim()) {
          errorMessage = 'Please share your experience';
        } else if (value.trim().length < 5) {
          errorMessage = 'Please provide more details about your experience';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  const validateForm = () => {
    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Check if there are any errors
    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const response = await axios.post('/api/surveys', formData);
      setSubmitMessage('Thank you for your feedback! Your survey has been successfully submitted.');
      
      // Reset form
      setFormData({
        recommendationRating: '',
        satisfactionRating: '',
        experience: '',
        contactPermission: '',
        furtherInfoPermission: '',
        fullName: '',
        phone: '',
        email: ''
      });
      
      // Reset touched and errors
      setTouched({});
      setErrors({});
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError(
        error.response?.data?.error || 
        'Failed to submit survey. Please check your connection and try again.'
      );
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating component
  const renderStarRating = (name, value, label) => {
    return (
      <div className="form-group">
        <label>{label}</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map(rating => (
            <div 
              className="star-option" 
              key={rating}
              onClick={() => handleChange({ target: { name, value: rating.toString() } })}
            >
              <span className={`star ${parseInt(value) >= rating ? 'selected' : ''}`}>★</span>
              <span className="star-label">{rating}</span>
            </div>
          ))}
        </div>
        {touched[name] && !value && <div className="error-message">Please select a rating</div>}
      </div>
    );
  };
  
  return (
    <div className="survey-form-container">
      <div className="survey-card">
        <div className="survey-header">
          <h2>DHL Customer Satisfaction Survey</h2>
          <p>We value your feedback. Please take a moment to share your experience with us.</p>
        </div>
        
        {submitMessage && <div className="alert alert-success">{submitMessage}</div>}
        {submitError && <div className="alert alert-error">{submitError}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Your Ratings</h3>
            
            {renderStarRating(
              'recommendationRating', 
              formData.recommendationRating, 
              'How likely are you to recommend DHL to a friend or colleague?'
            )}
            
            {renderStarRating(
              'satisfactionRating', 
              formData.satisfactionRating, 
              'How satisfied are you with our service?'
            )}
            
            <div className="form-group">
              <label>Please share your experience with us:</label>
              <textarea
                className={`form-control ${touched.experience && errors.experience ? 'error' : ''}`}
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="4"
              ></textarea>
              {touched.experience && errors.experience && (
                <div className="error-message">{errors.experience}</div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">Permissions</h3>
            
            <div className="form-group">
              <label>Contact Permission:</label>
              <select
                className={`form-control ${touched.contactPermission && !formData.contactPermission ? 'error' : ''}`}
                name="contactPermission"
                value={formData.contactPermission}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select an option</option>
                <option value="Yes, DHL can contact me if clarification is needed.">Yes, DHL can contact me if clarification is needed.</option>
                <option value="No, I prefer not to be contacted.">No, I prefer not to be contacted.</option>
              </select>
              {touched.contactPermission && !formData.contactPermission && (
                <div className="error-message">Please select a contact permission option</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Further Information Permission:</label>
              <select
                className={`form-control ${touched.furtherInfoPermission && !formData.furtherInfoPermission ? 'error' : ''}`}
                name="furtherInfoPermission"
                value={formData.furtherInfoPermission}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select an option</option>
                <option value="Yes, DHL can contact me if clarification is needed.">Yes, DHL can contact me if clarification is needed.</option>
                <option value="No, I prefer not to receive further information.">No, I prefer not to receive further information.</option>
              </select>
              {touched.furtherInfoPermission && !formData.furtherInfoPermission && (
                <div className="error-message">Please select a further information permission option</div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">Your Information</h3>
            
            <div className="form-group">
              <label>Full Name:</label>
              <input
                className={`form-control ${touched.fullName && errors.fullName ? 'error' : ''}`}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
              />
              {touched.fullName && errors.fullName && (
                <div className="error-message">{errors.fullName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                className={`form-control ${touched.phone && errors.phone ? 'error' : ''}`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your phone number"
              />
              {touched.phone && errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Email Address:</label>
              <input
                className={`form-control ${touched.email && errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email address"
              />
              {touched.email && errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
          </div>
          
          <button 
            className="submit-button" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;