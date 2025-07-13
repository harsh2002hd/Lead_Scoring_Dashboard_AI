import React, { useState } from 'react';

const LeadForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    job: 'admin.',
    marital: 'single',
    education: 'secondary',
    default: 'no',
    balance: '',
    housing: 'yes',
    loan: 'no',
    contact: 'unknown',
    duration: '',
    campaign: '',
    pdays: '',
    previous: '',
    poutcome: 'unknown',
    comments: '',
    email: '',
    phone: '',
    consent: false
  });

  const [errors, setErrors] = useState({});

  const jobOptions = [
    'admin.', 'technician', 'services', 'management', 'retired', 
    'blue-collar', 'self-employed', 'unemployed', 'entrepreneur', 'housemaid', 'student'
  ];

  const maritalOptions = ['single', 'married', 'divorced'];
  const educationOptions = ['primary', 'secondary', 'tertiary'];
  const defaultOptions = ['yes', 'no'];
  const housingOptions = ['yes', 'no'];
  const loanOptions = ['yes', 'no'];
  const contactOptions = ['unknown', 'telephone', 'cellular'];
  const poutcomeOptions = ['unknown', 'other', 'failure', 'success'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.balance || formData.balance < 0) {
      newErrors.balance = 'Balance must be non-negative';
    }

    if (!formData.duration || formData.duration < 0) {
      newErrors.duration = 'Duration must be non-negative';
    }

    if (!formData.campaign || formData.campaign < 0) {
      newErrors.campaign = 'Campaign must be non-negative';
    }

    if (!formData.pdays || formData.pdays < -1) {
      newErrors.pdays = 'Pdays must be -1 or greater';
    }

    if (!formData.previous || formData.previous < 0) {
      newErrors.previous = 'Previous must be non-negative';
    }

    if (!formData.consent) {
      newErrors.consent = 'Consent is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert numeric fields
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        balance: parseFloat(formData.balance),
        duration: parseInt(formData.duration),
        campaign: parseInt(formData.campaign),
        pdays: parseInt(formData.pdays),
        previous: parseInt(formData.previous)
      };
      
      onSubmit(submitData);
    }
  };

  const renderField = (name, label, type = 'text', options = null, placeholder = '') => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('age', 'Age', 'number', null, '25')}
        {renderField('job', 'Job Category', 'text', jobOptions)}
        {renderField('marital', 'Marital Status', 'text', maritalOptions)}
        {renderField('education', 'Education', 'text', educationOptions)}
        {renderField('default', 'Has Credit Default', 'text', defaultOptions)}
        {renderField('balance', 'Balance', 'number', null, '1000')}
        {renderField('housing', 'Has Housing Loan', 'text', housingOptions)}
        {renderField('loan', 'Has Personal Loan', 'text', loanOptions)}
        {renderField('contact', 'Contact Type', 'text', contactOptions)}
        {renderField('duration', 'Duration (seconds)', 'number', null, '300')}
        {renderField('campaign', 'Campaign Contacts', 'number', null, '1')}
        {renderField('pdays', 'Days Since Last Contact', 'number', null, '-1')}
        {renderField('previous', 'Previous Contacts', 'number', null, '0')}
        {renderField('poutcome', 'Previous Outcome', 'text', poutcomeOptions)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('email', 'Email (Optional)', 'email', null, 'john.doe@example.com')}
        {renderField('phone', 'Phone (Optional)', 'tel', null, '+91-9876543210')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comments
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleInputChange}
          placeholder="Enter any additional comments or notes about the lead..."
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Comments will be analyzed by the LLM reranker for intent keywords
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          I consent to data processing for lead scoring purposes
        </label>
      </div>
      {errors.consent && (
        <p className="text-red-500 text-sm">{errors.consent}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Scoring Lead...' : 'Score Lead'}
      </button>
    </form>
  );
};

export default LeadForm; 