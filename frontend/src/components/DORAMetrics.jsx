import React from 'react';

function DORAMetrics({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Deployment Frequency"
        value={data.deployment_frequency?.toFixed(2)}
        unit="per day"
      />
      <MetricCard
        title="Lead Time for Changes"
        value={data.lead_time_for_changes?.toFixed(2)}
        unit="hours"
      />
      <MetricCard
        title="Mean Time to Recovery"
        value={data.mean_time_to_recovery?.toFixed(2)}
        unit="hours"
      />
      <MetricCard
        title="Change Failure Rate"
        value={data.change_failure_rate?.toFixed(2)}
        unit="%"
      />
    </div>
  );
}

function MetricCard({ title, value, unit }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value || '—'}</p>
      <p className="text-gray-500 text-sm">{unit}</p>
    </div>
  );
}

export default DORAMetrics;