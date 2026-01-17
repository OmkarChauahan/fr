import React from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Charts = () => {
  // Volume vs Service Data
  const volumeData = [
    { month: 'Jan', volume: 65, service: 45 },
    { month: 'Feb', volume: 78, service: 52 },
    { month: 'Mar', volume: 70, service: 58 },
    { month: 'Apr', volume: 55, service: 65 },
    { month: 'May', volume: 82, service: 48 },
    { month: 'Jun', volume: 90, service: 70 }
  ];

  // Customer Fulfillment Data
  const fulfillmentData = [
    { month: 'Jan', fulfilled: 400, pending: 240 },
    { month: 'Feb', fulfilled: 300, pending: 139 },
    { month: 'Mar', fulfilled: 200, pending: 380 },
    { month: 'Apr', fulfilled: 278, pending: 390 },
    { month: 'May', fulfilled: 189, pending: 480 },
    { month: 'Jun', fulfilled: 239, pending: 380 }
  ];

  return (
    <div className="charts-grid">
      {/* Volume Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Performance Level</h3>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot volume"></span>
              Volume
            </span>
            <span className="legend-item">
              <span className="legend-dot service"></span>
              Service
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="volume" fill="#fbbf24" radius={[8, 8, 0, 0]} />
            <Bar dataKey="service" fill="#94a3b8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Fulfillment Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Customer Fulfillment</h3>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot fulfilled"></span>
              Fulfilled
            </span>
            <span className="legend-item">
              <span className="legend-dot pending"></span>
              Pending
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={fulfillmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="fulfilled" 
              stackId="1"
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="pending" 
              stackId="1"
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;