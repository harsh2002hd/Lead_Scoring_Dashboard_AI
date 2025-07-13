import React from 'react';

const ScoreChart = ({ leads }) => {
  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No data to display</div>
        <div className="text-gray-400 text-sm">
          Score some leads to see the distribution chart
        </div>
      </div>
    );
  }

  // Create score ranges
  const createScoreRanges = () => {
    const ranges = [
      { label: '0-20', min: 0, max: 20 },
      { label: '21-40', min: 21, max: 40 },
      { label: '41-60', min: 41, max: 60 },
      { label: '61-80', min: 61, max: 80 },
      { label: '81-100', min: 81, max: 100 }
    ];

    const initialCounts = ranges.map(() => 0);
    const rerankedCounts = ranges.map(() => 0);

    leads.forEach(lead => {
      // Count initial scores
      for (let i = 0; i < ranges.length; i++) {
        if (lead.initial_score >= ranges[i].min && lead.initial_score <= ranges[i].max) {
          initialCounts[i]++;
          break;
        }
      }

      // Count reranked scores
      for (let i = 0; i < ranges.length; i++) {
        if (lead.reranked_score >= ranges[i].min && lead.reranked_score <= ranges[i].max) {
          rerankedCounts[i]++;
          break;
        }
      }
    });

    return {
      labels: ranges.map(r => r.label),
      initialCounts,
      rerankedCounts
    };
  };

  const { labels, initialCounts, rerankedCounts } = createScoreRanges();
  const maxCount = Math.max(...initialCounts, ...rerankedCounts);

  // Calculate statistics
  const calculateStats = () => {
    if (leads.length === 0) return null;

    const initialScores = leads.map(l => l.initial_score);
    const rerankedScores = leads.map(l => l.reranked_score);

    const avgInitial = initialScores.reduce((a, b) => a + b, 0) / initialScores.length;
    const avgReranked = rerankedScores.reduce((a, b) => a + b, 0) / rerankedScores.length;

    const highIntentInitial = initialScores.filter(s => s >= 80).length;
    const highIntentReranked = rerankedScores.filter(s => s >= 80).length;

    return {
      avgInitial: avgInitial.toFixed(1),
      avgReranked: avgReranked.toFixed(1),
      highIntentInitial,
      highIntentReranked,
      totalLeads: leads.length
    };
  };

  const stats = calculateStats();

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Avg Initial Score</div>
            <div className="text-2xl font-bold text-blue-800">{stats.avgInitial}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Avg Reranked Score</div>
            <div className="text-2xl font-bold text-green-800">{stats.avgReranked}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">High Intent (≥80)</div>
            <div className="text-2xl font-bold text-purple-800">{stats.highIntentReranked}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Total Leads</div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalLeads}</div>
          </div>
        </div>
      )}

      {/* Simple bar chart using CSS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Distribution</h3>
        {labels.map((label, index) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{label}</span>
              <span>Initial: {initialCounts[index]} | Reranked: {rerankedCounts[index]}</span>
            </div>
            <div className="flex space-x-2 h-6">
              <div 
                className="bg-blue-500 rounded"
                style={{ 
                  width: `${(initialCounts[index] / Math.max(maxCount, 1)) * 100}%`,
                  minWidth: initialCounts[index] > 0 ? '4px' : '0'
                }}
                title={`Initial Score: ${initialCounts[index]}`}
              ></div>
              <div 
                className="bg-green-500 rounded"
                style={{ 
                  width: `${(rerankedCounts[index] / Math.max(maxCount, 1)) * 100}%`,
                  minWidth: rerankedCounts[index] > 0 ? '4px' : '0'
                }}
                title={`Reranked Score: ${rerankedCounts[index]}`}
              ></div>
            </div>
          </div>
        ))}
        <div className="flex space-x-4 text-xs text-gray-500 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            <span>Initial Score</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Reranked Score</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>High Intent Rate:</strong> {((stats.highIntentReranked / stats.totalLeads) * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Score Improvement:</strong> {(stats.avgReranked - stats.avgInitial).toFixed(1)} points average
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreChart; 