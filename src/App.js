// src/App.js
import React, { useState, useCallback, useMemo } from "react";
import "./App.css";

// =========================
// Constants & Validation
// =========================
const VALIDATION_RULES = {
  name: {
    required: true,
    validate: (value) => value.trim() ? "" : "Name is required"
  },
  email: {
    required: true,
    validate: (value) => {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    }
  },
  password: {
    required: true,
    validate: (value) => {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    }
  }
};

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  password: ""
};

// =========================
// Custom Hook: useForm
// =========================
const useForm = (initialState, validationRules) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return;

    const errorMessage = rule.validate(value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  }, [validationRules]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      newErrors[field] = rule.validate(formData[field]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err);
  }, [formData, validationRules]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  }, [validateField]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.length >= 6 &&
      !Object.values(errors).some(err => err)
    );
  }, [formData, errors]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    showPassword,
    isFormValid,
    handleChange,
    validateAll,
    resetForm,
    setIsSubmitting,
    togglePasswordVisibility
  };
};

// =========================
// Component: FormInput
// =========================
const FormInput = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon,
  isPassword = false,
  showPassword = false,
  onTogglePassword
}) => {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const hasError = !!error;
  const hasSuccess = value && !hasError;
  
  return (
    <div className="form-group">
      <label className="form-label">
        {label} <span className="required">*</span>
      </label>
      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`form-input ${
            hasError ? 'error' : 
            hasSuccess ? 'success' : ''
          }`}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      {!error && value && (
        <div className="success-message">✓ Valid</div>
      )}
    </div>
  );
};

// =========================
// Component: SubmitButton
// =========================
const SubmitButton = ({ isSubmitting, isFormValid }) => {
  return (
    <button 
      type="submit" 
      className="submit-btn"
      disabled={isSubmitting || !isFormValid}
    >
      {isSubmitting ? (
        <>
          <span className="spinner"></span>
          Creating Account...
        </>
      ) : (
        <>
          <span className="btn-icon">🚀</span>
          Create Account
        </>
      )}
    </button>
  );
};

// =========================
// Main App Component
// =========================
export default function App() {
  const {
    formData,
    errors,
    isSubmitting,
    showPassword,
    isFormValid,
    handleChange,
    validateAll,
    resetForm,
    setIsSubmitting,
    togglePasswordVisibility
  } = useForm(INITIAL_FORM_STATE, VALIDATION_RULES);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("🎉 Registration Successful!");
      console.log("Form Data:", formData);
      resetForm();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAll, resetForm, setIsSubmitting]);

  return (
    <div className="form-app">
      <div className="form-header">
        <span className="form-header-icon">✨</span>
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join us and get started</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon="👤"
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon="📧"
        />

        <FormInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon="🔒"
          isPassword={true}
          showPassword={showPassword}
          onTogglePassword={togglePasswordVisibility}
        />

        <SubmitButton 
          isSubmitting={isSubmitting} 
          isFormValid={isFormValid} 
        />
      </form>
    </div>
  );
}
