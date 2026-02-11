// Build a registration form with validations (email format, password length, required fields).
// Show error messages dynamically.

import React, { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

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

    if (!hasError) {
      alert("Registration Successful");
      console.log(formData);
    }
  };

  return (
    <div style={{ width: "300px", margin: "50px auto" }}>
      <h2>Registration Form</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p style={{ color: "red" }}>{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="text"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
