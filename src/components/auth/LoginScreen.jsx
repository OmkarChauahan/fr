import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Alert from '../common/Alert';

// ⭐ Environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginScreen = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
      } else {
        setError(result.error || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(registerData.password);
    const hasLowerCase = /[a-z]/.test(registerData.password);
    const hasNumber = /[0-9]/.test(registerData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, number and special character');
      setLoading(false);
      return;
    }

    try {
      // ⭐ FIXED - Using environment variable
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registration successful! Please login with your credentials.');
        
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          setLoginData({
            email: registerData.email,
            password: ''
          });
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!forgotEmail) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      // ⭐ FIXED - Using environment variable
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotEmail('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="floating-element element-1"></div>
            <div className="floating-element element-2"></div>
            <div className="floating-element element-3"></div>
            <div className="logo-section">
              <div className="logo-icon">WH</div>
              <h1>Reset Password</h1>
            </div>
            <p className="tagline">We'll send you a link to reset your password</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-card animate-slide-in">
            <div className="auth-header">
              <h2>Forgot Password?</h2>
              <p>Enter your email to receive reset link</p>
            </div>

            <form onSubmit={handleForgotPassword}>
              <Alert type="error" message={error} onClose={() => setError('')} />
              <Alert type="success" message={success} onClose={() => setSuccess('')} />

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                className="btn btn-text btn-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register Screen
  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <div className="illustration-content">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="logo-section">
            <div className="logo-icon">WH</div>
            <h1>WorkHub Solutions</h1>
          </div>
          <p className="tagline">Manage your business with ease</p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Complete Admin Control</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Real-time Analytics</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card animate-slide-in">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your admin panel' : 'Join us to manage your business'}</p>
          </div>

          <div className="auth-tabs">
            <button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
                setShowPassword(false);
              }}
            >
              Sign In
            </button>
            <button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="auth-form">
              <Alert type="error" message={error} onClose={() => setError('')} />
              <Alert type="success" message={success} onClose={() => setSuccess('')} />

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="admin@workhub.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <Alert type="error" message={error} onClose={() => setError('')} />
              <Alert type="success" message={success} onClose={() => setSuccess('')} />

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={20} />
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Min 8 characters"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating account...' : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;