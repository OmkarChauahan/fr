import React, { useState } from 'react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { APP_NAME } from '../../utils/constants';
import { Save, Shield, Bell } from 'lucide-react';

const Settings = () => {
  const [siteTitle, setSiteTitle] = useState(APP_NAME);
  const [contactEmail, setContactEmail] = useState('contact@workhub.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReports, setDailyReports] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSuccessMessage('General settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setSuccessMessage('Notification preferences saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header-modern">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and application settings</p>
        </div>
      </div>

      <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />

      <div className="settings-grid-modern">
        <div className="settings-card-modern">
          <div className="settings-card-header">
            <div className="settings-icon blue">
              <Save size={20} />
            </div>
            <h3>General Settings</h3>
          </div>
          <form onSubmit={handleSaveGeneral}>
            <div className="form-group">
              <label>Site Title</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </form>
        </div>

        <div className="settings-card-modern">
          <div className="settings-card-header">
            <div className="settings-icon green">
              <Bell size={20} />
            </div>
            <h3>Notification Settings</h3>
          </div>
          <form onSubmit={handleSaveNotifications}>
            <label className="checkbox-label-modern">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span>Email notifications for new inquiries</span>
            </label>
            <label className="checkbox-label-modern">
              <input
                type="checkbox"
                checked={dailyReports}
                onChange={(e) => setDailyReports(e.target.checked)}
              />
              <span>Daily summary reports</span>
            </label>
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </form>
        </div>

        <div className="settings-card-modern">
          <div className="settings-card-header">
            <div className="settings-icon purple">
              <Shield size={20} />
            </div>
            <h3>Account Security</h3>
          </div>
          <div className="security-actions">
            <Button variant="secondary" fullWidth>Change Password</Button>
            <Button variant="secondary" fullWidth>Enable Two-Factor Auth</Button>
            <Button variant="secondary" fullWidth>View Login History</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;