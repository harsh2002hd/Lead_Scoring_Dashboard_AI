import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeadForm from './components/LeadForm';
import LeadTable from './components/LeadTable';
import ScoreChart from './components/ScoreChart';
import Header from './components/Header';

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  // Save leads to localStorage whenever leads state changes
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  const handleLeadSubmit = async (leadData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/score`, leadData);
      
      const newLead = {
        id: Date.now(),
        email: leadData.email || 'anonymous@example.com',
        initial_score: response.data.initial_score,
        reranked_score: response.data.reranked_score,
        comments: leadData.comments,
        timestamp: new Date().toISOString(),
        ...leadData
      };

      setLeads(prevLeads => [newLead, ...prevLeads]);
      setSuccess('Lead scored successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error scoring lead:', err);
      setError(err.response?.data?.detail || 'Failed to score lead. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLeads = () => {
    setLeads([]);
    localStorage.removeItem('leads');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lead Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Lead Scoring Form
            </h2>
            <LeadForm onSubmit={handleLeadSubmit} loading={loading} />
          </div>

          {/* Score Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Score Distribution
            </h2>
            <ScoreChart leads={leads} />
          </div>
        </div>

        {/* Leads Table Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Scored Leads ({leads.length})
            </h2>
            {leads.length > 0 && (
              <button
                onClick={handleClearLeads}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear All Leads
              </button>
            )}
          </div>
          <LeadTable leads={leads} />
        </div>
      </div>
    </div>
  );
}

export default App; 