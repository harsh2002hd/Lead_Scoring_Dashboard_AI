import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Lead Scoring Dashboard</h1>
            <p className="text-blue-100 mt-2">
              Predict lead intent using Machine Learning and LLM Reranker
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              <p>Powered by FastAPI & React</p>
              <p>ML Model + LLM Reranker</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 