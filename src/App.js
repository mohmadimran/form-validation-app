import React, { useState } from "react";
import "./form-styles.css";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    validateField(name, value);
  };

  // =========================
  // Field Validation
  // =========================
  const validateField = (name, value) => {
    let message = "";

    if (name === "name") {
      if (!value.trim()) {
        message = "Name is required";
      }
    }

    if (name === "email") {
      if (!value) {
        message = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        message = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) {
        message = "Password is required";
      } else if (value.length < 6) {
        message = "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message
    }));
  };

  // =========================
  // Form Submit
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    // Check if any errors exist
    const hasError = Object.values(errors).some((err) => err);

    if (!hasError && Object.values(formData).every(val => val.trim())) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        alert("🎉 Registration Successful!");
        console.log(formData);
        setIsSubmitting(false);
        // Reset form
        setFormData({ name: "", email: "", password: "" });
        setErrors({});
      }, 1500);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.length >= 6 &&
      !Object.values(errors).some(err => err)
    );
  };

  return (
    <div className="form-app">
      <div className="form-header">
        <span className="form-header-icon">✨</span>
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join us and get started</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${
                errors.name ? 'error' : 
                formData.name && !errors.name ? 'success' : ''
              }`}
            />
          </div>
          {errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${
                errors.email ? 'error' : 
                formData.email && !errors.email ? 'success' : ''
              }`}
            />
          </div>
          {errors.email && (
            <div className="error-message">{errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">
            Password <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${
                errors.password ? 'error' : 
                formData.password && !errors.password ? 'success' : ''
              }`}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          {!errors.password && formData.password && formData.password.length > 0 && (
            <div style={{ 
              marginTop: '6px', 
              fontSize: '0.8rem', 
              color: '#2ecc71',
              fontWeight: '500'
            }}>
              ✓ Password is valid
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting || !isFormValid()}
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

        <div className="form-footer">
          Already have an account? <a href="#">Sign In</a>
        </div>
      </form>
    </div>
  );
}
