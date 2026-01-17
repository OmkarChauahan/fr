export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Improved email validation
export const validateEmail = (email) => {
  // Check basic format
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(email)) {
    return false;
  }

  // Check for common email providers or domain format
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const domain = parts[1];
  const domainParts = domain.split('.');
  
  // Domain should have at least 2 parts (e.g., gmail.com)
  if (domainParts.length < 2) {
    return false;
  }

  // Each part should have at least 2 characters
  for (let part of domainParts) {
    if (part.length < 2) {
      return false;
    }
  }

  return true;
};

// Password validation
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    errors: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    }
  };
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getBadgeColor = (status) => {
  const colors = {
    'Active': 'green',
    'Inactive': 'gray',
    'Pending': 'orange',
    'New': 'blue',
    'In Progress': 'orange',
    'Completed': 'green',
    'Cancelled': 'red',
    'Admin': 'purple',
    'User': 'blue',
    'Manager': 'green'
  };
  return colors[status] || 'gray';
};

// Check password strength
export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 2) return { level: 'weak', color: '#ef4444', text: 'Weak' };
  if (strength <= 4) return { level: 'medium', color: '#f59e0b', text: 'Medium' };
  return { level: 'strong', color: '#10b981', text: 'Strong' };
};
