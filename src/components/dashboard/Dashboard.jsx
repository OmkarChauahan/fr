import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import TopProducts from './TopProducts';
import Charts from './Charts';
import dashboardService from '../../services/dashboardService';
import { Users, MessageSquare, Briefcase, DollarSign } from 'lucide-react';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivities()
      ]);
      
      setStats(statsResponse.data.stats);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="page-content">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      change: stats.usersChange, 
      icon: Users, 
      color: 'blue',
      subtitle: 'from last month'
    },
    { 
      title: 'Active Inquiries', 
      value: stats.activeInquiries, 
      change: stats.inquiriesChange, 
      icon: MessageSquare, 
      color: 'green',
      subtitle: 'from last week'
    },
    { 
      title: 'Total Services', 
      value: stats.totalServices, 
      change: stats.servicesChange, 
      icon: Briefcase, 
      color: 'purple',
      subtitle: 'No change'
    },
    { 
      title: 'Monthly Revenue', 
      value: stats.monthlyRevenue, 
      change: stats.revenueChange, 
      icon: DollarSign, 
      color: 'orange',
      subtitle: 'from last month'
    }
  ];

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-modern">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <Charts />

      {/* Bottom Grid - Optimized */}
      <div className="dashboard-bottom-grid">
        {/* Top Products */}
        <TopProducts />

        {/* Activity Feed */}
        <div className="dashboard-card-modern">
          <div className="card-header-modern">
            <h3>Recent Activity</h3>
            <button className="btn-link">View All</button>
          </div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
