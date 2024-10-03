import React from 'react';
import { useSelector } from 'react-redux';

const Analytics = () => {
  const metrics = useSelector((state) => state.dashboard.metrics);

  return (
    <div>
      <h3 className="text-lg font-semibold">Analytics</h3>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
};

export default Analytics;
