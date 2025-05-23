// utils/validation.js
export const validateUsername = (username) => {
  const errors = [];
  
  // Check for empty username
  if (!username.trim()) {
    return ['Username is required'];
  }

  // Check for spaces
  if (/\s/.test(username)) {
    errors.push('No spaces allowed');
  }

  // Check for special characters (only letters and numbers allowed)
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.push('Only letters and numbers allowed');
  }

  // Check for email-like patterns
  if (/@/.test(username)) {
    errors.push('Email addresses not allowed as username');
  }

  return errors.length ? errors : null;
};